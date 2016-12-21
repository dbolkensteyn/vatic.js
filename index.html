<!doctype html>

<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>vatic.js A pure Javascript video annotation tool</title>
    <style>
      .output { font-family: monospace; font-weight: bold; }

      #doodle {
        position: relative;
        width: 0px;
        height: 0px;
        z-index: 2;
      }

      #canvas {
        z-index: 1;
      }

      .bbox {
        border: 1px solid #FF0000;
        position: absolute;
        z-index: 3;
      }

      .handle, .ui-resizable-handle {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        border: 1px solid rgba(255, 0, 0, .5);
        background-color: rgba(255, 255, 0, .05);
        position: absolute;
      }

      .center-drag {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: move;
      }

      .ui-resizable-n {
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: n-resize;
      }

      .ui-resizable-s {
        left: 50%;
        bottom: 0%;
        transform: translate(-50%, 50%);
        cursor: s-resize;
      }

      .ui-resizable-w {
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: w-resize;
      }

      .ui-resizable-e {
        right: 0%;
        top: 50%;
        transform: translate(50%, -50%);
        cursor: e-resize;
      }

      .ui-slider {
        position: relative;
        text-align: left;
        height: .8em;
      }

      .ui-slider-handle {
        position: absolute;
        z-index: 2;
        width: 1.2em;
        height: 1.2em;
        cursor: default;
        -ms-touch-action: none;
        touch-action: none;
        top: -.3em;
        margin-left: -.6em;
      }

      .ui-widget.ui-widget-content {
        border: 1px solid #d3d3d3;
      }

      .ui-state-default {
        border: 1px solid #d3d3d3;
        background-color: #e6e6e6;
      }

      .ui-state-hover, .ui-state-focus {
        border: 1px solid #999999;
        background-color: #dadada;
      }

      .ui-state-active {
        border: 1px solid #aaaaaa;
        background-color: #ffffff;
      }

      .ui-state-disabled {
        opacity: .35;
      }

      .ui-corner-all {
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>vatic.js A pure Javascript video annotation tool</h1>

    <ol>
      <li>
        <p>This tool can be used to easily annotate a video, without having to install anything.</p>
        <p>Optical flow is used to track your annotations, so that have to do as little work as possible ;-)</p>
        <p>This tool works best in Chrome, and has also been successfully tested in Firefox.</p>
      </li>
      <li>
        <p>To start a new video annotation, select a video file: <input type="file" id="videoFile" accept="video/*" /></p>
        <p>To resume a previous annotation, select a frames zip archive: <input type="file" id="zipFile" accept=".zip" /></p>
        <p>Note: Keep the focus on the browser during the entire extraction process, or frames might be skipped.</p>
        <p class="output" id="videoDimensions"></p>
        <p class="output" id="extractionProgress"></p>
      </li>
      <li>
        <p>Download the extracted frames zip archive: <input type="button" id="downloadFrames" value="Get frames zip archive" disabled="disabled" /></p>
      </li>
      <li>
        <p>Optional: Load an existing <a href="http://web.mit.edu/vondrick/vatic/" target="new">vatic</a>-compatible XML annotation file: <input type="file" id="xmlFile" accept=".xml" disabled="true" /></p>
        <p>This is useful for example if:</p>
        <ul>
          <li>You are resuming a previous annotation.</li>
          <li>You already have a first version of your automatic object detector, which you want to improve by manually correcting its errors.</li>
        </ul>
        <p>Note: Launch your object detector on the extracted frames rather than on the original video to avoid frame/annotation mismatches!</p>
      </li>
      <li>
        <p>Manually annotate the frame sequence:</p>
        <p>To create a new bounding box, first click 'n' (for new), and then left click on two locations in the video corresponding to the corners of the box.</p>
        <p>Tip: Use the spacebar to play/pause the video, and the left and right arrows to navigate frame by frame.</p>
        <p>Tip: The visibility of each object can be toogled with its visiblity checkbox under the video.</p>
        <p>Tip: Zoom in with your browser to place the bounding boxes more accurately.</p>
        <div id="doodle">
          <canvas id="canvas"></canvas>
        </div>
        <p><input type="button" id="play" value="Play" disabled="true" /><input type="button" id="pause" value="Pause" disabled="true" style="display: none;" /></p>
        <div id="slider"></div>
        <p><label for="speed">Speed multiplier: </label><input type="text" id="speed" value="1.00" size="4" /></p>
        <div id="objects"></div>
      </li>
      <li>
        <p><input type="button" id="generateXml" value="Generate" disabled="true" /> the <a href="http://web.mit.edu/vondrick/vatic/" target="new">vatic</a>-compatible XML annotations file.</p>
      </li>
    </ol>

  <a href="https://github.com/dbolkensteyn/vatic.js" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#FD6C6C; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>

    <script type="text/javascript" src="dist/compatibility.js"></script>
    <script type="text/javascript" src="dist/jszip.js"></script>
    <script type="text/javascript" src="dist/StreamSaver.js"></script>
    <script type="text/javascript" src="dist/polyfill.js"></script>
    <script type="text/javascript" src="dist/jsfeat.js"></script>
    <script type="text/javascript" src="dist/nudged.js"></script>
    <script type="text/javascript" src="dist/pouchdb.min.js"></script>
    <script type="text/javascript" src="dist/jquery-1.12.4.js"></script>
    <script type="text/javascript" src="dist/jquery-ui.js"></script>
    <script type="text/javascript" src="vatic.js"></script>
    <script type="text/javascript">
      "use strict";

      let config = {
        // Should be higher than real FPS to not skip real frames
        // Hardcoded due to JS limitations
        fps: 30,

        // Low rate decreases the chance of losing frames with poor browser performances
        playbackRate: 0.4,

        // Format of the extracted frames
        imageMimeType: 'image/jpeg',
        imageExtension: '.jpg',

        // Name of the extracted frames zip archive
        framesZipFilename: 'extracted-frames.zip'
      };

      let doodle = document.querySelector('#doodle');
      let canvas = document.querySelector('#canvas');
      let ctx = canvas.getContext('2d');
      let videoFile = document.querySelector('#videoFile');
      let zipFile = document.querySelector('#zipFile');
      let xmlFile = document.querySelector('#xmlFile');
      let videoDimensionsElement = document.querySelector('#videoDimensions');
      let extractionProgressElement = document.querySelector('#extractionProgress');
      let downloadFramesButton = document.querySelector('#downloadFrames');
      let playButton = document.querySelector('#play');
      let pauseButton = document.querySelector('#pause');
      let speedInput = document.querySelector('#speed');
      let sliderElement = document.querySelector('#slider');
      let generateXmlButton = document.querySelector('#generateXml');

      let framesManager = new FramesManager();
      let annotatedObjectsTracker = new AnnotatedObjectsTracker(framesManager);

      let slider = {
        init: function(min, max, onChange) {
          $(sliderElement).slider('option', 'min', min);
          $(sliderElement).slider('option', 'max', max);
          $(sliderElement).on('slidestop', (e, ui) => {
            onChange(ui.value);
          });
          $(sliderElement).slider('enable');
        },
        setPosition: function(frameNumber) {
          $(sliderElement).slider('option', 'value', frameNumber);
        },
        reset: function() {
          $(sliderElement).slider({disabled: true});
        }
      };
      slider.reset();

      let player = {
        currentFrame: 0,
        isPlaying: false,
        isReady: false,
        timeout: null,

        initialize: function() {
          this.currentFrame = 0;
          this.isPlaying = false;
          this.isReady = false;

          playButton.disabled = true;
          playButton.style.display = 'block';
          pauseButton.disabled = true;
          pauseButton.style.display = 'none';
        },

        ready: function() {
          this.isReady = true;

          playButton.disabled = false;
        },

        seek: function(frameNumber) {
          if (!this.isReady) {
            return;
          }

          this.pause();

          if (frameNumber >= 0 && frameNumber < framesManager.frames.totalFrames()) {
            this.drawFrame(frameNumber);
            this.currentFrame = frameNumber;
          }
        },

        play: function() {
          if (!this.isReady) {
            return;
          }

          this.isPlaying = true;

          playButton.disabled = true;
          playButton.style.display = 'none';
          pauseButton.disabled = false;
          pauseButton.style.display = 'block';

          this.nextFrame();
        },

        pause: function() {
          if (!this.isReady) {
            return;
          }

          this.isPlaying = false;
          if (this.timeout != null) {
            clearTimeout(this.timeout);
            this.timeout = null;
          }

          pauseButton.disabled = true;
          pauseButton.style.display = 'none';
          playButton.disabled = false;
          playButton.style.display = 'block';
        },

        toogle: function() {
          if (!this.isPlaying) {
            this.play();
          } else {
            this.pause();
          }
        },

        nextFrame: function() {
          if (!this.isPlaying) {
            return;
          }

          if (this.currentFrame >= framesManager.frames.totalFrames()) {
            this.done();
            return;
          }

          this.drawFrame(this.currentFrame).then(() => {
            this.currentFrame++;
            this.timeout = setTimeout(() => this.nextFrame(), 1000 / (config.fps * parseFloat(speedInput.value)));
          });
        },

        drawFrame: function(frameNumber) {
          return new Promise((resolve, _) => {
            annotatedObjectsTracker.getFrameWithObjects(frameNumber).then((frameWithObjects) => {
              ctx.drawImage(frameWithObjects.img, 0, 0);

              for (let i = 0; i < frameWithObjects.objects.length; i++) {
                let object = frameWithObjects.objects[i];
                let annotatedObject = object.annotatedObject;
                let annotatedFrame = object.annotatedFrame;
                if (annotatedFrame.isVisible()) {
                  annotatedObject.dom.style.display = 'block';
                  annotatedObject.dom.style.width = annotatedFrame.bbox.width + 'px';
                  annotatedObject.dom.style.height = annotatedFrame.bbox.height + 'px';
                  annotatedObject.dom.style.left = annotatedFrame.bbox.x + 'px';
                  annotatedObject.dom.style.top = annotatedFrame.bbox.y + 'px';
                  annotatedObject.visible.prop('checked', true);
                } else {
                  annotatedObject.dom.style.display = 'none';
                  annotatedObject.visible.prop('checked', false);
                }
              }

              let shouldHideOthers = frameWithObjects.objects.some(o => o.annotatedObject.hideOthers);
              if (shouldHideOthers) {
                for (let i = 0; i < frameWithObjects.objects.length; i++) {
                  let object = frameWithObjects.objects[i];
                  let annotatedObject = object.annotatedObject;
                  if (!annotatedObject.hideOthers) {
                    annotatedObject.dom.style.display = 'none';
                  }
                }
              }

              slider.setPosition(this.currentFrame);

              resolve();
            });
          });
        },

        done: function() {
          this.currentFrame = 0;
          this.isPlaying = false;

          playButton.disabled = false;
          playButton.style.display = 'block';
          pauseButton.disabled = true;
          pauseButton.style.display = 'none';
        }
      };

      function clearAllAnnotatedObjects() {
        for (let i = 0; i < annotatedObjectsTracker.annotatedObjects.length; i++) {
          clearAnnotatedObject(i);
        }
      }

      function clearAnnotatedObject(i) {
        let annotatedObject = annotatedObjectsTracker.annotatedObjects[i];
        annotatedObject.controls.remove();
        $(annotatedObject.dom).remove();
        annotatedObjectsTracker.annotatedObjects.splice(i, 1);
      }

      videoFile.addEventListener('change', extractionFileUploaded, false);
      zipFile.addEventListener('change', extractionFileUploaded, false);
      xmlFile.addEventListener('change', importXml, false);
      playButton.addEventListener('click', playClicked, false);
      pauseButton.addEventListener('click', pauseClicked, false);
      downloadFramesButton.addEventListener('click', downloadFrames, false);
      generateXmlButton.addEventListener('click', generateXml, false);

      function playClicked() {
        player.play();
      }

      function pauseClicked() {
        player.pause();
      }

      function downloadFrames() {
        let zip = new JSZip();

        let processed = 0;
        let totalFrames = framesManager.frames.totalFrames();
        for (let i = 0; i < totalFrames; i++) {
          framesManager.frames.getFrame(i).then((blob) => {
            zip.file(i + '.jpg', blob);

            processed++;
            if (processed == totalFrames) {
              let writeStream = streamSaver.createWriteStream('extracted-frames.zip').getWriter();
              zip.generateInternalStream({type: 'uint8array', streamFiles: true})
                 .on('data', data => writeStream.write(data))
                 .on('end', () => writeStream.close())
                 .resume();
            }
          });
        }
      }

      function initializeCanvasDimensions(img) {
        doodle.style.width = img.width + 'px';
        doodle.style.height = img.height + 'px';
        canvas.width = img.width;
        canvas.height = img.height;
        sliderElement.style.width = img.width + 'px';
      }

      function extractionFileUploaded() {
        if (this.files.length != 1) {
          return;
        }

        videoFile.disabled = true;
        zipFile.disabled = true;
        xmlFile.disabled = true;
        downloadFramesButton.disabled = true;
        generateXmlButton.disabled = true;
        clearAllAnnotatedObjects();
        slider.reset();
        player.initialize();

        let promise;
        if (this == videoFile) {
          let dimensionsInitialized = false;

          promise = extractFramesFromVideo(
            config,
            this.files[0],
            (percentage, framesSoFar, lastFrameBlob) => {
              blobToImage(lastFrameBlob).then((img) => {
                if (!dimensionsInitialized) {
                  dimensionsInitialized = true;
                  initializeCanvasDimensions(img);
                }
                ctx.drawImage(img, 0, 0);

                videoDimensionsElement.innerHTML = 'Video dimensions determined: ' + img.width + 'x' + img.height;
                extractionProgressElement.innerHTML = (percentage * 100).toFixed(2) + ' % completed. ' + framesSoFar + ' frames extracted.';
              });
            });
        } else {
          promise = extractFramesFromZip(config, this.files[0]);
        }

        promise.then((frames) => {
          extractionProgressElement.innerHTML = 'Extraction completed. ' + frames.totalFrames() + ' frames captured.';
          if (frames.totalFrames() > 0) {
            frames.getFrame(0).then((blob) => {
              blobToImage(blob).then((img) => {
                initializeCanvasDimensions(img);
                ctx.drawImage(img, 0, 0);
                videoDimensionsElement.innerHTML = 'Video dimensions determined: ' + img.width + 'x' + img.height;

                framesManager.set(frames);
                slider.init(
                  0,
                  framesManager.frames.totalFrames() - 1,
                  (frameNumber) => player.seek(frameNumber)
                );
                player.ready();

                xmlFile.disabled = false;
                playButton.disabled = false;
                downloadFramesButton.disabled = false;
                generateXmlButton.disabled = false;
              });
            });
          }

          videoFile.disabled = false;
          zipFile.disabled = false;
        });
      }

      function interactify(dom, onChange) {
        let bbox = $(dom);
        bbox.addClass('bbox');

        let createHandleDiv = (className) => {
          let handle = document.createElement('div');
          handle.className = className;
          bbox.append(handle);
          return handle;
        };

        bbox.resizable({
          containment: 'parent',
          handles: {
            n: createHandleDiv('ui-resizable-handle ui-resizable-n'),
            s: createHandleDiv('ui-resizable-handle ui-resizable-s'),
            e: createHandleDiv('ui-resizable-handle ui-resizable-e'),
            w: createHandleDiv('ui-resizable-handle ui-resizable-w')
          },
          stop: (e, ui) => {
            let position = bbox.position();
            onChange(Math.round(position.left), Math.round(position.top), Math.round(bbox.width()), Math.round(bbox.height()));
          }
        });

        bbox.draggable({
          containment: 'parent',
          handle: createHandleDiv('handle center-drag'),
          stop: (e, ui) => {
            let position = bbox.position();
            onChange(Math.round(position.left), Math.round(position.top), Math.round(bbox.width()), Math.round(bbox.height()));
          }
        });
      }

      let mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      };

      let tmpAnnotatedObject = null;

      doodle.onmousemove = function (e) {
        let ev = e || window.event;
        if (ev.pageX) {
          mouse.x = ev.pageX;
          mouse.y = ev.pageY;
        } else if (ev.clientX) {
          mouse.x = ev.clientX;
          mouse.y = ev.clientY;
        }
        mouse.x -= doodle.offsetLeft;
        mouse.y -= doodle.offsetTop;

        if (tmpAnnotatedObject !== null) {
          tmpAnnotatedObject.width = Math.abs(mouse.x - mouse.startX);
          tmpAnnotatedObject.height = Math.abs(mouse.y - mouse.startY);
          tmpAnnotatedObject.x = (mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX;
          tmpAnnotatedObject.y = (mouse.y - mouse.startY < 0) ? mouse.y : mouse.startY;

          tmpAnnotatedObject.dom.style.width = tmpAnnotatedObject.width + 'px';
          tmpAnnotatedObject.dom.style.height = tmpAnnotatedObject.height + 'px';
          tmpAnnotatedObject.dom.style.left = tmpAnnotatedObject.x + 'px';
          tmpAnnotatedObject.dom.style.top = tmpAnnotatedObject.y + 'px';
        }
      }

      doodle.onclick = function (e) {
        if (doodle.style.cursor != 'crosshair') {
          return;
        }

        if (tmpAnnotatedObject != null) {
          let annotatedObject = new AnnotatedObject();
          annotatedObject.dom = tmpAnnotatedObject.dom;
          let bbox = new BoundingBox(tmpAnnotatedObject.x, tmpAnnotatedObject.y, tmpAnnotatedObject.width, tmpAnnotatedObject.height);
          annotatedObject.add(new AnnotatedFrame(player.currentFrame, bbox, true));
          annotatedObjectsTracker.annotatedObjects.push(annotatedObject);
          tmpAnnotatedObject = null;

          interactify(
            annotatedObject.dom,
            (x, y, width, height) => {
              let bbox = new BoundingBox(x, y, width, height);
              annotatedObject.add(new AnnotatedFrame(player.currentFrame, bbox, true));
            }
          );

          addAnnotatedObjectControls(annotatedObject);

          doodle.style.cursor = 'default';
        } else {
          mouse.startX = mouse.x;
          mouse.startY = mouse.y;

          let dom = newBboxElement();
          dom.style.left = mouse.x + 'px';
          dom.style.top = mouse.y + 'px';
          tmpAnnotatedObject = { dom: dom };
        }
      }

      function newBboxElement() {
          let dom = document.createElement('div');
          dom.className = 'bbox';
          doodle.appendChild(dom);
          return dom;
      }

      function addAnnotatedObjectControls(annotatedObject) {
        let name = $('<input type="text" value="Name?" />');
        if (annotatedObject.name) {
          name.val(annotatedObject.name);
        }
        name.on('change keyup paste mouseup', function() {
          annotatedObject.name = this.value;
        });

        let id = $('<input type="text" value="ID?" />');
        if (annotatedObject.id) {
          id.val(annotatedObject.id);
        }
        id.on('change keyup paste mouseup', function() {
          annotatedObject.id = this.value;
        });

        let visibleLabel = $('<label>');
        let visible = $('<input type="checkbox" checked="checked" />');
        annotatedObject.visible = visible;
        visible.change(function() {
          let bbox;
          if (this.checked) {
            annotatedObject.dom.style.display = 'block';
            let jquery = $(annotatedObject.dom);
            let position = jquery.position();
            bbox = new BoundingBox(Math.round(position.left), Math.round(position.top), Math.round(jquery.width()), Math.round(jquery.height()));
          } else {
            annotatedObject.dom.style.display = 'none';
            bbox = null;
          }
          annotatedObject.add(new AnnotatedFrame(player.currentFrame, bbox, true));
        });
        visibleLabel.append(visible);
        visibleLabel.append('Is visible?');

        let hideLabel = $('<label>');
        let hide = $('<input type="checkbox" />');
        hide.change(function() {
          annotatedObject.hideOthers = this.checked;
        });
        hideLabel.append(hide);
        hideLabel.append('Hide others?');

        let del = $('<input type="button" value="Delete" />');
        del.click(function() {
          for (let i = 0; annotatedObjectsTracker.annotatedObjects.length; i++) {
            if (annotatedObject === annotatedObjectsTracker.annotatedObjects[i]) {
              clearAnnotatedObject(i);
              break;
            }
          }
        });

        let div = $('<div></div>');
        div.css({
          'border': '1px solid black',
          'display': 'inline-block',
          'margin': '5px',
          'padding': '10px'});
        div.append(name);
        div.append($('<br />'));
        div.append(id);
        div.append($('<br />'));
        div.append(visibleLabel);
        div.append($('<br />'));
        div.append(hideLabel);
        div.append($('<br />'));
        div.append(del);

        annotatedObject.controls = div;

        $('#objects').append(div);
      }

      function generateXml() {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<annotation>\n';
        xml += '  <folder>not available</folder>\n';
        xml += '  <filename>not available</filename>\n';
        xml += '  <source>\n';
        xml += '    <type>video</type>\n';
        xml += '    <sourceImage>vatic frames</sourceImage>\n';
        xml += '    <sourceAnnotation>vatic</sourceAnnotation>\n';
        xml += '  </source>\n';

        let totalFrames = framesManager.frames.totalFrames();
        for (let i = 0; i < annotatedObjectsTracker.annotatedObjects.length; i++) {
          let annotatedObject = annotatedObjectsTracker.annotatedObjects[i];

          xml += '  <object>\n';
          xml += '    <name>' + annotatedObject.name + '</name>\n';
          xml += '    <moving>true</moving>\n';
          xml += '    <action/>\n';
          xml += '    <verified>0</verified>\n';
          xml += '    <id>' + annotatedObject.id + '</id>\n';
          xml += '    <createdFrame>0</createdFrame>\n';
          xml += '    <startFrame>0</startFrame>\n';
          xml += '    <endFrame>' + (totalFrames - 1 ) + '</endFrame>\n';

          for (let frameNumber = 0; frameNumber < totalFrames; frameNumber++) {
            let annotatedFrame = annotatedObject.get(frameNumber);
            if (annotatedFrame == null) {
              window.alert('Play the video in full before downloading the XML so that bounding box data is available for all frames.');
              return;
            }

            let bbox = annotatedFrame.bbox;
            if (bbox != null) {
              let isGroundThrugh = annotatedFrame.isGroundTruth ? 1 : 0;

              xml += '    ';
              xml += '<polygon>';
              xml += '<t>' + frameNumber + '</t>';
              xml += '<pt><x>' + bbox.x + '</x><y>' + bbox.y + '</y><l>' + isGroundThrugh + '</l></pt>';
              xml += '<pt><x>' + bbox.x + '</x><y>' + (bbox.y + bbox.height) + '</y><l>' + isGroundThrugh + '</l></pt>';
              xml += '<pt><x>' + (bbox.x + bbox.width) + '</x><y>' + (bbox.y + bbox.height) + '</y><l>' + isGroundThrugh + '</l></pt>';
              xml += '<pt><x>' + (bbox.x + bbox.width) + '</x><y>' + bbox.y + '</y><l>' + isGroundThrugh + '</l></pt>';
              xml += '</polygon>\n';
            }
          }

          xml += '  </object>\n';
        }

        xml += '</annotation>\n';

        let writeStream = streamSaver.createWriteStream('output.xml').getWriter();
        let encoder = new TextEncoder();
        writeStream.write(encoder.encode(xml));
        writeStream.close();
      }

      function importXml() {
        if (this.files.length != 1) {
          return;
        }

        var reader = new FileReader();
        reader.onload = (e) => {
          if (e.target.readyState != 2) {
            return;
          }

          if (e.target.error) {
            throw 'file reader error';
          }

          let xml = $($.parseXML(e.target.result));
          let objects = xml.find('object');
          for (let i = 0; i < objects.length; i++) {
            let object = $(objects[i]);
            let name = object.find('name').text();
            let id = object.find('id').text();

            let annotatedObject = new AnnotatedObject();
            annotatedObject.name = name;
            annotatedObject.id = id;
            annotatedObject.dom = newBboxElement();
            annotatedObjectsTracker.annotatedObjects.push(annotatedObject);

            interactify(
              annotatedObject.dom,
              (x, y, width, height) => {
                let bbox = new BoundingBox(x, y, width, height);
                annotatedObject.add(new AnnotatedFrame(player.currentFrame, bbox, true));
              }
            );

            addAnnotatedObjectControls(annotatedObject);

            let lastFrame = -1;
            let polygons = object.find('polygon');
            for (let j = 0; j < polygons.length; j++) {
              let polygon = $(polygons[j]);
              let frameNumber = parseInt(polygon.find('t').text());
              let pts = polygon.find('pt');
              let topLeft = $(pts[0]);
              let bottomRight = $(pts[2]);
              let isGroundThrough = parseInt(topLeft.find('l').text()) == 1;
              let x = parseInt(topLeft.find('x').text());
              let y = parseInt(topLeft.find('y').text());
              let w = parseInt(bottomRight.find('x').text()) - x;
              let h = parseInt(bottomRight.find('y').text()) - y;

              if (lastFrame + 1 != frameNumber) {
                let annotatedFrame = new AnnotatedFrame(lastFrame + 1, null, true);
                annotatedObject.add(annotatedFrame);
              }

              let bbox = new BoundingBox(x, y, w, h);
              let annotatedFrame = new AnnotatedFrame(frameNumber, bbox, isGroundThrough);
              annotatedObject.add(annotatedFrame);

              lastFrame = frameNumber;
            }

            if (lastFrame + 1 < framesManager.frames.totalFrames()) {
              let annotatedFrame = new AnnotatedFrame(lastFrame + 1, null, true);
              annotatedObject.add(annotatedFrame);
            }
          }

          player.drawFrame(player.currentFrame);
        };
        reader.readAsText(this.files[0]);
      }

      // Keyboard shortcuts
      window.onkeydown = function(e) {
        let preventDefault = true;

        if (e.keyCode === 32) { // space
          player.toogle();
        } else if (e.keyCode === 78) { // n
          doodle.style.cursor = 'crosshair';
        } else if (e.keyCode === 27) { // escape
          if (tmpAnnotatedObject != null) {
            doodle.removeChild(tmpAnnotatedObject.dom);
            tmpAnnotatedObject = null;
          }

          doodle.style.cursor = 'default';
        } else if (e.keyCode == 37) { // left
          player.seek(player.currentFrame - 1);
        } else if (e.keyCode == 39) { // right
          player.seek(player.currentFrame + 1);
        } else {
          preventDefault = false;
        }

        if (preventDefault) {
          e.preventDefault();
        }
      };
    </script>
  </body>
</html>
