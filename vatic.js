"use strict";

class FramesManager {
  constructor() {
    this.frames = {
      totalFrames: () => { return 0; }
    };
    this.onReset = [];
  }

  set(frames) {
    this.frames = frames;
    for (let i = 0; i < this.onReset.length; i++) {
      this.onReset[i]();
    }
  }
}

function blobToImage(blob) {
  return new Promise((result, _) => {
    let img = new Image();
    img.onload = function() {
      result(img);
      URL.revokeObjectURL(this.src);
    };
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Extracts the frame sequence of a video file.
 */
function extractFramesFromVideo(config, file, progress) {
  let resolve = null;
  let db = null;
  let video = document.createElement('video');
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  let dimensionsInitialized = false;
  let totalFrames = 0;
  let processedFrames = 0;
  let lastApproxFrame = -1;
  let lastProgressFrame = -1;
  let attachmentName = 'img' + config.imageExtension;

  return new Promise((_resolve, _) => {
    resolve = _resolve;

    let dbName = 'vatic_js';
    db = new PouchDB(dbName).destroy().then(() => {
      db = new PouchDB(dbName);

      video.autoplay = false;
      video.muted = true;
      video.loop = false;
      video.playbackRate = config.playbackRate;
      video.src = URL.createObjectURL(file);
      compatibility.requestAnimationFrame(onBrowserAnimationFrame);
      video.play();
    });
  });

  function onBrowserAnimationFrame() {
    if (dimensionsInitialized && video.ended) {
      if (processedFrames == totalFrames) {
        videoEnded();
      }
      return;
    }

    compatibility.requestAnimationFrame(onBrowserAnimationFrame);

    if (video.readyState !== video.HAVE_CURRENT_DATA &&
        video.readyState !== video.HAVE_FUTURE_DATA &&
        video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    let currentApproxFrame = Math.round(video.currentTime * config.fps);
    if (currentApproxFrame != lastApproxFrame) {
      lastApproxFrame = currentApproxFrame;
      let frameNumber = totalFrames;
      totalFrames++;

      if (!dimensionsInitialized) {
        dimensionsInitialized = true;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => {
          db.putAttachment(frameNumber.toString(), attachmentName, blob, config.imageMimeType).then((doc) => {
            processedFrames++;

            if (frameNumber > lastProgressFrame) {
              lastProgressFrame = frameNumber;
              progress(video.currentTime / video.duration, processedFrames, blob);
            }

            if (video.ended && processedFrames == totalFrames) {
              videoEnded();
            }
          });
        },
        config.imageMimeType);
    }
  }

  function videoEnded() {
    if (video.src != '') {
      URL.revokeObjectURL(video.src);
      video.src = '';

      resolve({
        totalFrames: () => { return totalFrames; },
        getFrame: (frameNumber) => {
          return db.getAttachment(frameNumber.toString(), attachmentName);
        }
      });
    }
  }
}

/**
 * Extracts the frame sequence from a previously generated zip file.
 */
function extractFramesFromZip(config, file) {
  return new Promise((resolve, _) => {
    JSZip
      .loadAsync(file)
      .then((zip) => {
        let totalFrames = 0;
        for (let i = 0; ; i++) {
          let file = zip.file(i + config.imageExtension);
          if (file == null) {
            totalFrames = i;
            break;
          }
        }

        resolve({
          totalFrames: () => { return totalFrames; },
          getFrame: (frameNumber) => {
            return new Promise((resolve, _) => {
              let file = zip.file(frameNumber + config.imageExtension);
              file
                .async('arraybuffer')
                .then((content) => {
                  let blob = new Blob([ content ], {type: config.imageMimeType});
                  resolve(blob);
                });
            });
          }
        });
      });
  });
}

/**
 * Tracks point between two consecutive frames using optical flow.
 */
class OpticalFlow {
  constructor() {
    this.isInitialized = false;
    this.previousPyramid = new jsfeat.pyramid_t(3);
    this.currentPyramid = new jsfeat.pyramid_t(3);
  }

  init(imageData) {
    this.previousPyramid.allocate(imageData.width, imageData.height, jsfeat.U8_t | jsfeat.C1_t);
    this.currentPyramid.allocate(imageData.width, imageData.height, jsfeat.U8_t | jsfeat.C1_t);
    jsfeat.imgproc.grayscale(imageData.data, imageData.width, imageData.height, this.previousPyramid.data[0]);
    this.previousPyramid.build(this.previousPyramid.data[0]);
    this.isInitialized = true;
  }

  reset() {
    this.isInitialized = false;
  }

  track(imageData, bboxes) {
    if (!this.isInitialized) {
      throw 'not initialized';
    }

    jsfeat.imgproc.grayscale(imageData.data, imageData.width, imageData.height, this.currentPyramid.data[0]);
    this.currentPyramid.build(this.currentPyramid.data[0]);

    // TODO: Move all configuration to config
    let bboxBorderWidth = 1;

    let pointsPerDimension = 11;
    let pointsPerObject = pointsPerDimension * pointsPerDimension;
    let pointsCountUpperBound = bboxes.length * pointsPerObject;
    let pointsStatus = new Uint8Array(pointsCountUpperBound);
    let previousPoints = new Float32Array(pointsCountUpperBound * 2);
    let currentPoints = new Float32Array(pointsCountUpperBound * 2);

    let pointsCount = 0;
    for (let i = 0, n = 0; i < bboxes.length; i++) {
      let bbox = bboxes[i];
      if (bbox != null) {
        for (let x = 0; x < pointsPerDimension; x++) {
          for (let y = 0; y < pointsPerDimension; y++) {
            previousPoints[pointsCount*2] = bbox.x + x * (bbox.width / (pointsPerDimension - 1));
            previousPoints[pointsCount*2 + 1] = bbox.y + y * (bbox.height / (pointsPerDimension - 1));
            pointsCount++;
          }
        }
      }
    }
    if (pointsCount == 0) {
      throw 'no points to track';
    }

    jsfeat.optical_flow_lk.track(this.previousPyramid, this.currentPyramid, previousPoints, currentPoints, pointsCount, 30, 30, pointsStatus, 0.01, 0.001);

    let newBboxes = [];
    let p = 0;
    for (let i = 0; i < bboxes.length; i++) {
      let bbox = bboxes[i];
      let newBbox = null;

      if (bbox != null) {
        let before = [];
        let after = [];

        for (let j = 0; j < pointsPerObject; j++, p++) {
          if (pointsStatus[p] == 1) {
            let x = p * 2;
            let y = x + 1;

            before.push([previousPoints[x], previousPoints[y]]);
            after.push([currentPoints[x], currentPoints[y]]);
          }
        }

        if (before.length > 0) {
          let diff = nudged.estimate('T', before, after);
          let translation = diff.getTranslation();

          let minX = Math.max(Math.round(bbox.x + translation[0]), 0);
          let minY = Math.max(Math.round(bbox.y + translation[1]), 0);
          let maxX = Math.min(Math.round(bbox.x + bbox.width + translation[0]), imageData.width - 2*bboxBorderWidth);
          let maxY = Math.min(Math.round(bbox.y + bbox.height + translation[1]), imageData.height - 2*bboxBorderWidth);
          let newWidth = maxX - minX;
          let newHeight = maxY - minY;

          if (newWidth > 0 && newHeight > 0) {
            newBbox = new BoundingBox(minX, minY, newWidth, newHeight);
          }
        }
      }

      newBboxes.push(newBbox);
    }

    // Swap current and previous pyramids
    let oldPyramid = this.previousPyramid;
    this.previousPyramid = this.currentPyramid;
    this.currentPyramid = oldPyramid; // Buffer re-use

    return newBboxes;
  }
};

/**
 * Represents the coordinates of a bounding box
 */
class BoundingBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

/**
 * Represents a bounding box at a particular frame.
 */
class AnnotatedFrame {
  constructor(frameNumber, bbox, isGroundTruth) {
    this.frameNumber = frameNumber;
    this.bbox = bbox;
    this.isGroundTruth = isGroundTruth;
  }

  isVisible() {
    return this.bbox != null;
  }
}

/**
 * Represents an object bounding boxes throughout the entire frame sequence.
 */
class AnnotatedObject {
  constructor() {
    this.frames = [];
  }

  add(frame) {
    for (let i = 0; i < this.frames.length; i++) {
      if (this.frames[i].frameNumber == frame.frameNumber) {
        this.frames[i] = frame;
        this.removeFramesToBeRecomputedFrom(i + 1);
        return;
      } else if (this.frames[i].frameNumber > frame.frameNumber) {
        this.frames.splice(i, 0, frame);
        this.removeFramesToBeRecomputedFrom(i + 1);
        this.injectInvisibleFrameAtOrigin();
        return;
      }
    }

    this.frames.push(frame);
    this.injectInvisibleFrameAtOrigin();
  }

  get(frameNumber) {
    for (let i = 0; i < this.frames.length; i++) {
      let currentFrame = this.frames[i];
      if (currentFrame.frameNumber > frameNumber) {
        break;
      }

      if (currentFrame.frameNumber == frameNumber) {
        return currentFrame;
      }
    }

    return null;
  }

  removeFramesToBeRecomputedFrom(frameNumber) {
    let count = 0;
    for (let i = frameNumber; i < this.frames.length; i++) {
      if (this.frames[i].isGroundTruth) {
        break;
      }
      count++;
    }
    if (count > 0) {
      this.frames.splice(frameNumber, count);
    }
  }

  injectInvisibleFrameAtOrigin() {
    if (this.frames.length == 0 || this.frames[0].frameNumber > 0) {
      this.frames.splice(0, 0, new AnnotatedFrame(0, null, false));
    }
  }
}

/**
 * Tracks annotated objects throughout a frame sequence using optical flow.
 */
class AnnotatedObjectsTracker {
  constructor(framesManager) {
    this.framesManager = framesManager;
    this.annotatedObjects = [];
    this.opticalFlow = new OpticalFlow();
    this.lastFrame = -1;
    this.ctx = document.createElement('canvas').getContext('2d');

    this.framesManager.onReset.push(() => {
      this.annotatedObjects = [];
      this.lastFrame = -1;
    });
  }

  getFrameWithObjects(frameNumber) {
    return new Promise((resolve, _) => {
      let i = this.startFrame(frameNumber);

      let trackNextFrame = () => {
        this.track(i).then((frameWithObjects) => {
          if (i == frameNumber) {
            resolve(frameWithObjects);
          } else {
            i++;
            trackNextFrame();
          }
        });
      };

      trackNextFrame();
    });
  }

  startFrame(frameNumber) {
    for (; frameNumber >= 0; frameNumber--) {
      let allObjectsHaveData = true;

      for (let i = 0; i < this.annotatedObjects.length; i++) {
        let annotatedObject = this.annotatedObjects[i];
        if (annotatedObject.get(frameNumber) == null) {
          allObjectsHaveData = false;
          break;
        }
      }

      if (allObjectsHaveData) {
        return frameNumber;
      }
    }

    throw 'corrupted object annotations';
  }

  track(frameNumber) {
    return new Promise((resolve, _) => {
      this.framesManager.frames.getFrame(frameNumber).then((blob) => {
        blobToImage(blob).then((img) => {
          let result = [];
          let toCompute = [];
          for (let i = 0; i < this.annotatedObjects.length; i++) {
            let annotatedObject = this.annotatedObjects[i];
            let annotatedFrame = annotatedObject.get(frameNumber);
            if (annotatedFrame == null) {
              annotatedFrame = annotatedObject.get(frameNumber - 1);
              if (annotatedFrame == null) {
                throw 'tracking must be done sequentially';
              }
              toCompute.push({annotatedObject: annotatedObject, bbox: annotatedFrame.bbox});
            } else {
              result.push({annotatedObject: annotatedObject, annotatedFrame: annotatedFrame});
            }
          }

          let bboxes = toCompute.map(c => c.bbox);
          let hasAnyBbox = bboxes.some(bbox => bbox != null);
          let optionalOpticalFlowInit;
          if (hasAnyBbox) {
            optionalOpticalFlowInit = this.initOpticalFlow(frameNumber - 1);
          } else {
            optionalOpticalFlowInit = new Promise((r, _) => { r(); });
          }

          optionalOpticalFlowInit.then(() => {
            let newBboxes;
            if (hasAnyBbox) {
              let imageData = this.imageData(img);
              newBboxes = this.opticalFlow.track(imageData, bboxes);
              this.lastFrame = frameNumber;
            } else {
              newBboxes = bboxes;
            }

            for (let i = 0; i < toCompute.length; i++) {
              let annotatedObject = toCompute[i].annotatedObject;
              let annotatedFrame = new AnnotatedFrame(frameNumber, newBboxes[i], false);
              annotatedObject.add(annotatedFrame);
              result.push({annotatedObject: annotatedObject, annotatedFrame: annotatedFrame});
            }

            resolve({img: img, objects: result});
          });
        });
      });
    });
  }

  initOpticalFlow(frameNumber) {
    return new Promise((resolve, _) => {
      if (this.lastFrame != -1 && this.lastFrame == frameNumber) {
        resolve();
      } else {
        this.opticalFlow.reset();
        this.framesManager.frames.getFrame(frameNumber).then((blob) => {
          blobToImage(blob).then((img) => {
            let imageData = this.imageData(img);
            this.opticalFlow.init(imageData);
            this.lastFrame = frameNumber;
            resolve();
          });
        });
      }
    });
  }

  imageData(img) {
    let canvas = this.ctx.canvas;
    canvas.width = img.width;
    canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);
    return this.ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
};
