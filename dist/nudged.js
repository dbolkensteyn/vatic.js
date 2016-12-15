(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nudged = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

*/
exports.Transform = require('./lib/Transform');
exports.estimateT = require('./lib/estimateT');
exports.estimateS = require('./lib/estimateS');
exports.estimateR = require('./lib/estimateR');
exports.estimateTS = require('./lib/estimateTS');
exports.estimateTR = require('./lib/estimateTR');
exports.estimateSR = require('./lib/estimateSR');
exports.estimateTSR = require('./lib/estimateTSR');
exports.version = require('./lib/version');

exports.create = function (scale, rotation, tx, ty) {
  // Create a nudged.Transform instance by using more meaningful parameters
  // than directly calling 'new nudged.Transform(...)'
  //
  // Parameters:
  //   scale
  //     number, the scaling factor
  //   rotation
  //     number, rotation in radians from positive x axis towards pos. y axis.
  //   tx
  //     translation toward pos. x
  //   ty
  //     translation toward pos. y

  if (typeof scale !== 'number') { scale = 1; }
  if (typeof rotation !== 'number') { rotation = 0; }
  if (typeof tx !== 'number') { tx = 0; }
  if (typeof ty !== 'number') { ty = 0; }

  var s = scale * Math.cos(rotation);
  var r = scale * Math.sin(rotation);
  return new exports.Transform(s, r, tx, ty);
};

exports.createFromArray = function (arr) {
  // Create a nudged.Transform instance from an array that was
  // previously created with nudged.Transform#toArray().
  //
  // Together with nudged.Transform#toArray(), this method makes an easy
  // serialization and deserialization to and from JSON possible.
  //
  // Parameter:
  //   arr
  //     array with four elements

  var s = arr[0];
  var r = arr[1];
  var tx = arr[2];
  var ty = arr[3];
  return new exports.Transform(s, r, tx, ty);
};

exports.estimate = function (type, domain, range, pivot) {
  // Parameter
  //   type
  //     string. One of the following: 'T', 'S', 'R', 'TS', 'TR', 'SR', 'TSR'
  //   domain
  //     array of 2d arrays
  //   range
  //     array of 2d arrays
  //   pivot
  //     optional 2d array, does nothing for translation estimators
  var name = 'estimate' + type.toUpperCase();
  if (exports.hasOwnProperty(name)) {
    return exports[name](domain, range, pivot);
  } // else
  throw new Error('Unknown estimator type: ' + type);
};

},{"./lib/Transform":2,"./lib/estimateR":3,"./lib/estimateS":4,"./lib/estimateSR":5,"./lib/estimateT":6,"./lib/estimateTR":7,"./lib/estimateTS":8,"./lib/estimateTSR":9,"./lib/version":10}],2:[function(require,module,exports){

var Transform = function (s, r, tx, ty) {

  // Public, to allow user access
  this.s = s;
  this.r = r;
  this.tx = tx;
  this.ty = ty;

  this.equals = function (t) {
    return (s === t.s && r === t.r && tx === t.tx && ty === t.ty);
  };

  this.getMatrix = function () {
    // Get the transformation matrix in the format common to
    // many APIs, including:
    // - kld-affine
    //
    // Return
    //   object o, having properties a, b, c, d, e, f:
    //   [ s  -r  tx ]   [ o.a  o.c  o.e ]
    //   [ r   s  ty ] = [ o.b  o.d  o.f ]
    //   [ 0   0   1 ]   [  -    -    -  ]
    return { a: s, b: r, c: -r, d: s, e: tx, f: ty };
  };

  this.getRotation = function () {
    // in rads
    return Math.atan2(r, s);
  };

  this.getScale = function () {
    // scale multiplier
    return Math.sqrt(r * r + s * s);
  };

  this.getTranslation = function () {
    // Current translation as a point.
    return [tx, ty];
  };

  this.toArray = function () {
    // Return an array representation of the transformation.
    //
    // Together with nudged.createFromArray(...), this method makes an easy
    // serialization and deserialization to and from JSON possible.
    return [s, r, tx, ty];
  };


  // Methods that return new points

  this.transform = function (p) {
    // p
    //   point [x, y] or array of points [[x1,y1], [x2, y2], ...]

    if (typeof p[0] === 'number') {
      // Single point
      return [s * p[0] - r * p[1] + tx, r * p[0] + s * p[1] + ty];
    } // else

    var i, c = [];
    for (i = 0; i < p.length; i += 1) {
      c.push([s * p[i][0] - r * p[i][1] + tx, r * p[i][0] + s * p[i][1] + ty]);
    }
    return c;
  };


  // Methods that return new Transformations

  this.inverse = function () {
    // Return inversed transform instance
    // See note 2015-10-26-16-30
    var det = s * s + r * r;
    // Test if singular transformation. These might occur when all the range
    // points are the same, forcing the scale to drop to zero.
    var eps = 0.00000001;
    if (Math.abs(det) < eps) {
      throw new Error('Singular transformations cannot be inversed.');
    }
    var shat = s / det;
    var rhat = -r / det;
    var txhat = (-s * tx - r * ty) / det;
    var tyhat = ( r * tx - s * ty) / det;
    return new Transform(shat, rhat, txhat, tyhat);
  };

  this.translateBy = function (dx, dy) {
    return new Transform(s, r, tx + dx, ty + dy);
  };

  this.scaleBy = function (multiplier, pivot) {
    // Parameter
    //   multiplier
    //   pivot
    //     optional, a [x, y] point
    var m, x, y;
    m = multiplier; // alias
    if (typeof pivot === 'undefined') {
      x = y = 0;
    } else {
      x = pivot[0];
      y = pivot[1];
    }
    return new Transform(m * s, m * r, m * tx + (1-m) * x, m * ty + (1-m) * y);
  };

  this.rotateBy = function (radians, pivot) {
    // Parameter
    //   radians
    //     from positive x to positive y axis
    //   pivot
    //     optional, a [x, y] point
    var co, si, x, y, shat, rhat, txhat, tyhat;
    co = Math.cos(radians);
    si = Math.sin(radians);
    if (typeof pivot === 'undefined') {
      x = y = 0;
    } else {
      x = pivot[0];
      y = pivot[1];
    }
    shat = s * co - r * si;
    rhat = s * si + r * co;
    txhat = (tx - x) * co - (ty - y) * si + x;
    tyhat = (tx - x) * si + (ty - y) * co + y;
    return new Transform(shat, rhat, txhat, tyhat);
  };


  this.multiplyBy = function (transform) {
    // Multiply this transformation matrix A
    // from the right with the given transformation matrix B
    // and return the result AB

    // For reading aid:
    // s -r tx  t.s -r tx
    // r  s ty *  r  s ty
    // 0  0  1    0  0  1
    var t = transform; // alias
    var shat = s * t.s - r * t.r;
    var rhat = s * t.r + r * t.s;
    var txhat = s * t.tx - r * t.ty + tx;
    var tyhat = r * t.tx + s * t.ty + ty;
    return new Transform(shat, rhat, txhat, tyhat);
  };
};

Transform.IDENTITY = new Transform(1, 0, 0, 0);

module.exports = Transform;

},{}],3:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  var i, N, D, a0, b0, a, b, c, d, ac, ad, bc, bd, shat, rhat, tx, ty;

  N = Math.min(domain.length, range.length);
  ac = ad = bc = bd = 0;

  if (typeof pivot === 'undefined') {
    a0 = b0 = 0;
  } else {
    a0 = pivot[0];
    b0 = pivot[1];
  }

  for (i = 0; i < N; i += 1) {
    a = domain[i][0] - a0;
    b = domain[i][1] - b0;
    c = range[i][0] - a0;
    d = range[i][1] - b0;
    ac += a * c;
    ad += a * d;
    bc += b * c;
    bd += b * d;
  }

  p = ac + bd;
  q = ad - bc;

  D = Math.sqrt(p * p + q * q);

  if (D === 0) {
    // D === 0
    // <=> q === 0 and p === 0.
    // <=> ad === bc and ac === -bd
    // <=> domain in pivot OR range in pivot OR yet unknown cases
    //     where the angle cannot be determined.
    // D === 0 also if N === 0.
    // Assume identity transform to be the best guess
    return Transform.IDENTITY;
  }

  shat = p / D;
  rhat = q / D;
  tx = a0 - a0 * shat + b0 * rhat;
  ty = b0 - a0 * rhat - b0 * shat;

  return new Transform(shat, rhat, tx, ty);
};

},{"./Transform":2}],4:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  var i, N, D, a0, b0, a, b, c, d, ac, bd, aa, bb, shat, tx, ty;

  N = Math.min(domain.length, range.length);
  ac = bd = aa = bb = 0;

  if (typeof pivot === 'undefined') {
    a0 = b0 = 0;
  } else {
    a0 = pivot[0];
    b0 = pivot[1];
  }

  for (i = 0; i < N; i += 1) {
    a = domain[i][0] - a0;
    b = domain[i][1] - b0;
    c = range[i][0] - a0;
    d = range[i][1] - b0;
    ac += a * c;
    bd += b * d;
    aa += a * a;
    bb += b * b;
  }

  D = aa + bb;

  if (D === 0) {
    // All domain points equal the pivot.
    // Identity transform is then only solution.
    // D === 0 also if N === 0.
    // Assume identity transform to be the best guess
    return Transform.IDENTITY;
  }

  // Prevent negative scaling because it would be same as positive scaling
  // and rotation => limit to zero
  shat = Math.max(0, (ac + bd) / D);
  tx = (1 - shat) * a0;
  ty = (1 - shat) * b0;

  return new Transform(shat, 0, tx, ty);
};

},{"./Transform":2}],5:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range, pivot) {
  // Estimate optimal transformation given the domain and the range
  // so that the pivot point remains the same.
  //
  // Use cases
  //   - transform an image that has one corner fixed with a pin.
  //   - allow only scale and rotation by fixing the middle of the object
  //     to transform.
  //
  // Parameters
  //   domain, an array of [x, y] points
  //   range, an array of [x, y] points
  //   pivot, optional
  //     the point [x, y] that must remain constant in the tranformation.
  //     Defaults to origo [0, 0]
  //
  //
  var X, Y, N, s, r, tx, ty;

  // Optional pivot
  if (typeof pivot === 'undefined') {
    pivot = [0, 0];
  }

  // Alias
  X = domain;
  Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  N = Math.min(X.length, Y.length);

  var v = pivot[0];
  var w = pivot[1];

  var i, a, b, c, d;
  var a2, b2;
  a2 = b2 = 0;
  var ac, bd, bc, ad;
  ac = bd = bc = ad = 0;

  for (i = 0; i < N; i += 1) {
    a = X[i][0] - v;
    b = X[i][1] - w;
    c = Y[i][0] - v;
    d = Y[i][1] - w;
    a2 += a * a;
    b2 += b * b;
    ac += a * c;
    bd += b * d;
    bc += b * c;
    ad += a * d;
  }

  // Denominator = determinant.
  // It becomes zero iff N = 0 or X[i] = [v, w] for every i in [0, n).
  // In other words, iff all the domain points are under the fixed point or
  // there is no domain points.
  var den = a2 + b2;

  var eps = 0.00000001;
  if (Math.abs(den) < eps) {
    // The domain points are under the pivot or there is no domain points.
    // We assume identity transform be the simplest guess. It keeps
    // the domain points under the pivot if there is some.
    return new Transform(1, 0, 0, 0);
  }

  // Estimators
  s = (ac + bd) / den;
  r = (-bc + ad) / den;
  tx =  w * r - v * s + v;
  ty = -v * r - w * s + w;

  return new Transform(s, r, tx, ty);
};

},{"./Transform":2}],6:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  var i, N, a1, b1, c1, d1, txhat, tyhat;

  N = Math.min(domain.length, range.length);
  a1 = b1 = c1 = d1 = 0;

  if (N < 1) {
    // Assume identity transform be the best guess
    return Transform.IDENTITY;
  }

  for (i = 0; i < N; i += 1) {
    a1 += domain[i][0];
    b1 += domain[i][1];
    c1 += range[i][0];
    d1 += range[i][1];
  }

  txhat = (c1 - a1) / N;
  tyhat = (d1 - b1) / N;

  return new Transform(1, 0, txhat, tyhat);
};

},{"./Transform":2}],7:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays

  // Alias
  var X = domain;
  var Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  var N = Math.min(X.length, Y.length);

  var i, a, b, c, d, a1, b1, c1, d1, ac, ad, bc, bd;
  a1 = b1 = c1 = d1 = ac = ad = bc = bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    ac += a * c;
    ad += a * d;
    bc += b * c;
    bd += b * d;
  }

  // Denominator.
  var v = N * (ad - bc) - a1 * d1 + b1 * c1;
  var w = N * (ac + bd) - a1 * c1 - b1 * d1;
  var D = Math.sqrt(v * v + w * w);

  if (D === 0) {
    // N === 0 => D === 0
    if (N === 0) {
      return new Transform(1, 0, 0, 0);
    } // else
    // D === 0 <=> undecidable
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 - a1) / N, (d1 - b1) / N);
  }

  // Estimators
  var shat = w / D;
  var rhat = v / D;
  var txhat = (-a1 * shat + b1 * rhat + c1) / N;
  var tyhat = (-a1 * rhat - b1 * shat + d1) / N;

  return new Transform(shat, rhat, txhat, tyhat);
};

},{"./Transform":2}],8:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays

  // Alias
  var X = domain;
  var Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  var N = Math.min(X.length, Y.length);

  var i, a, b, c, d, a1, b1, c1, d1, a2, b2, ac, bd;
  a1 = b1 = c1 = d1 = a2 = b2 = ac = bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    a2 += a * a;
    b2 += b * b;
    ac += a * c;
    bd += b * d;
  }

  // Denominator.
  var N2 = N * N;
  var a12 = a1 * a1;
  var b12 = b1 * b1;
  var p = a2 + b2;
  var q = ac + bd;
  var D = N2 * p - N * (a12 + b12);

  if (D === 0) {
    // N === 0 => D === 0
    if (N === 0) {
      return new Transform(1, 0, 0, 0);
    } // else
    // D === 0 <=> all the domain points are the same
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 / N) - a, (d1 / N) - b);
  }

  // Estimators
  var shat = (N2 * q - N * (a1 * c1 + b1 * d1)) / D;
  var txhat = (-N * a1 * q + N * c1 * p - b12 * c1 + a1 * b1 * d1) / D;
  var tyhat = (-N * b1 * q + N * d1 * p - a12 * d1 + a1 * b1 * c1) / D;

  return new Transform(shat, 0, txhat, tyhat);
};

},{"./Transform":2}],9:[function(require,module,exports){
var Transform = require('./Transform');

module.exports = function (domain, range) {
  // Parameters
  //   domain
  //     array of [x, y] 2D arrays
  //   range
  //     array of [x, y] 2D arrays
  var X, Y, N, s, r, tx, ty;

  // Alias
  X = domain;
  Y = range;

  // Allow arrays of different length but
  // ignore the extra points.
  N = Math.min(X.length, Y.length);

  // If length is zero, no estimation can be done. We choose the indentity
  // transformation be the best quess.
  if (N === 0) {
    return new Transform(1, 0, 0, 0);
  } // else

  var i, a, b, c, d;
  var a1 = 0;
  var b1 = 0;
  var c1 = 0;
  var d1 = 0;
  var a2 = 0;
  var b2 = 0;
  var ad = 0;
  var bc = 0;
  var ac = 0;
  var bd = 0;
  for (i = 0; i < N; i += 1) {
    a = X[i][0];
    b = X[i][1];
    c = Y[i][0];
    d = Y[i][1];
    a1 += a;
    b1 += b;
    c1 += c;
    d1 += d;
    a2 += a * a;
    b2 += b * b;
    ad += a * d;
    bc += b * c;
    ac += a * c;
    bd += b * d;
  }

  // Denominator.
  // It is zero iff X[i] = X[j] for every i and j in [0, n).
  // In other words, iff all the domain points are the same or there is only one domain point.
  var den = N * a2 + N * b2 - a1 * a1 - b1 * b1;

  var eps = 0.00000001;
  if (-eps < den && den < eps) {
    // The domain points are the same.
    // We guess the translation to the mean of the range to be the best guess.
    // Here a, b represents the mean of domain points.
    return new Transform(1, 0, (c1 / N) - a, (d1 / N) - b);
  }

  // Estimators
  s = (N * (ac + bd) - a1 * c1 - b1 * d1) / den;
  r = (N * (ad - bc) + b1 * c1 - a1 * d1) / den;
  tx = (-a1 * (ac + bd) + b1 * (ad - bc) + a2 * c1 + b2 * c1) / den;
  ty = (-b1 * (ac + bd) - a1 * (ad - bc) + a2 * d1 + b2 * d1) / den;

  return new Transform(s, r, tx, ty);
};

},{"./Transform":2}],10:[function(require,module,exports){
module.exports = '1.2.0';

},{}]},{},[1])(1)
});