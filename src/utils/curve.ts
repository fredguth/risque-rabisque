import Point from './point';

// // Based on SignaturePad
// // https://github.com/szimek/signature_pad
// // https://medium.com/square-corner-blog/smoother-signatures-be64515adb33

export function addPointToCurve(point:Point, points:Array<Point>) {

  if (points.length > 2) {

    if (points.length === 3) points.unshift(points[0]);

    let temp = getCurveControlPoints(points[0], points[1], points[2]);
    const a = temp.c2;
    temp = getCurveControlPoints(points[1], points[2], points[3]);
    const b = temp.c1;

    const curve  = new Bezier(points[1], a, b, points[2]);

    points.shift();
    return curve;
  }

  return null;
}


// //https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Higher-order_curves
export function drawCurve (ctx, curve) {

  console.log('ctx:', JSON.stringify(ctx));

  const drawSteps = Math.floor(curve.length());

  ctx.beginPath();

  for (let i = 0; i < drawSteps; i += 1) {
    // Calculate the Bezier (x, y) coordinate for this step.
    const t = i / drawSteps;
    const tt = t * t;
    const ttt = tt * t;
    const u = 1 - t;
    const uu = u * u;
    const uuu = uu * u;

    let x = uuu * curve.startPoint.x;
    x += 3 * uu * t * curve.control1.x;
    x += 3 * u * tt * curve.control2.x;
    x += ttt * curve.endPoint.x;

    let y = uuu * curve.startPoint.y;
    y += 3 * uu * t * curve.control1.y;
    y += 3 * u * tt * curve.control2.y;
    y += ttt * curve.endPoint.y;


    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // x  The x-coordinate of the center of the circle
    // y  The y-coordinate of the center of the circle
    // r  The radius of the circle
    // sAngle  The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle  The ending angle, in radians
    // counterclockwise  Optional.
    ctx.moveTo(x, y);
    ctx.arc(x, y, ctx.lineWidth, 0, 2 * Math.PI, false);
  }

  ctx.closePath();
  ctx.fill();
  return ctx;
};



function getCurveControlPoints (s1, s2, s3) {


  // deltas
  const dx1 = s1.x - s2.x;
  const dy1 = s1.y - s2.y;
  const dx2 = s2.x - s3.x;
  const dy2 = s2.y - s3.y;

  // midpoints
  const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
  const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

  // distances
  const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
  const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

  // midpoints delta
  const dxm = (m1.x - m2.x);
  const dym = (m1.y - m2.y);

  const k = l2 / (l1 + l2);
  const cm = { x: m2.x + (dxm * k), y: m2.y + (dym * k) };

  const tx = s2.x - cm.x;
  const ty = s2.y - cm.y;

  return {
    c1: new Point(m1.x + tx, m1.y + ty),
    c2: new Point(m2.x + tx, m2.y + ty),
  };
};

class Bezier {
  startPoint: Point;
  control1: Point;
  control2: Point;
  endPoint: Point;


  constructor(startPoint, control1, control2, endPoint) {

    this.startPoint = startPoint;
    this.control1 = control1;
    this.control2 = control2;
    this.endPoint = endPoint;
  }

  length() {

    const steps = 10;
    let length = 0;
    let px;
    let py;

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const cx = this.calcPoint(
        t,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x,
      );
      const cy = this.calcPoint(
        t,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y,
      );
      if (i > 0) {
        const xdiff = cx - px;
        const ydiff = cy - py;
        length += Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
      }
      px = cx;
      py = cy;
    }

    return length;
  }

  calcPoint (t, start, c1, c2, end) {
    return (       start * (1.0 - t) * (1.0 - t)  * (1.0 - t))
         + (3.0 *  c1    * (1.0 - t) * (1.0 - t)  * t)
         + (3.0 *  c2    * (1.0 - t) * t          * t)
         + (       end   * t         * t          * t);
  };
}






// // SignaturePad.prototype._drawDot = function (point) {
// //   const ctx = this._ctx;
// //   const width = (typeof this.dotSize) === 'function' ? this.dotSize() : this.dotSize;

// //   ctx.beginPath();
// //   this._drawPoint(point.x, point.y, width);
// //   ctx.closePath();
// //   ctx.fill();
// // };
