
export default class Point {
  x:number;
  y:number;
  timestamp: number;

  constructor (x:number, y:number, timestamp = new Date().getTime()) {

    this.x  = x;
    this.y  = y;
    this.timestamp = timestamp;

  }

  distanceTo(p2: Point) {
    let p1 = this;
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  halfPointTo(p2: Point) {
    let p1 = this;
    let x = p1.x + (p2.x - p1.x)/2;
    let y = p1.y + (p2.y - p1.y)/2;
    return new Point( x, y );
  }

  equals(p: Point) {
    return (this.x === p.x && this.y === p.y);
  }

  strictlyEqualsTo(p: Point) {
   return (this.x === p.x && this.y === p.y && this.timestamp === p.timestamp);
  }

  velocityFrom (p) {
  return (this.timestamp !== p.timestamp) ? this.distanceTo(p) / (this.timestamp - p.timestamp) : 1;
};


}