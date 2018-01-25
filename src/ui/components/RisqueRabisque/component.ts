
import Component, { tracked } from '@glimmer/component';
import Point from '../../../utils/point';
import { throttle } from '../../../utils/run';
import { drawCurve, addPointToCurve} from '../../../utils/curve';

export interface PadState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  undo: CanvasRenderingContext2D;
  position: Point; //mouse position
  brush: HTMLImageElement;
  brushOn: Boolean;
  points: Array<Point>;
  velocity: number;
  width: number;
}

export default class RisqueRabisque extends Component {
  @tracked state: PadState;
  reset: PadState; // initial state
  options: any = {
    strokeStyle:"#df4b26",
    lineJoin: 'round',
    lineCap: 'round',
    lineWidth: 4,
    throttleWait: 16,
    minDistanceBetweenPoints: 5,
    minWidth: 3,
    maxWidth: 5
  };
  moveUpdate: Function = throttle(this.move, this.options.throttleWait);


  didInsertElement() {
    let canvas = <HTMLCanvasElement> (this.bounds.firstNode as HTMLElement).querySelector('canvas');
    let ctx = canvas.getContext('2d');

    // move to options
    let { strokeStyle, lineJoin, lineCap, lineWidth } = this.options;

    ctx.strokeStyle = strokeStyle;
    ctx.lineJoin = lineJoin;
    ctx.lineCap = lineCap;
    ctx.lineWidth = lineWidth;

    let undo = ctx;

    let brush = new Image();
    brush.src = 'brush_ps16.png';

    this.reset = {
      canvas,
      ctx,
      undo,
      position: new Point(0, 0),
      brush,
      brushOn: false,
      points:[],
      velocity:0,
      width: 2.0
    };

    this.state = this.reset;
  }

  mouseDown(event) {

    let newState:PadState = this.state;
    let mousePoint = new Point (event.offsetX, event.offsetY);

    newState = {
     ...newState,
     brushOn: true,
     position: mousePoint,
     points: [mousePoint],
     undo: this.state.ctx
    }

    this.state = newState;

  }

  mouseMove(event) {
    if (this.state.brushOn ) {

      this.moveUpdate(event);
    }
  }

  mouseUp (event) {

    let newState:PadState = this.state;
    let mousePoint = new Point (event.offsetX, event.offsetY);

    newState = {
     ...newState,
     brushOn: false,
     position: mousePoint,
     points:[],
     undo: this.state.ctx
    }

    this.state = newState;
  }


  move(event) {

    let newState:PadState = this.state;
    let { points, undo, ctx, velocity, width } = this.state;
    const { minDistanceBetweenPoints } = this.options;
    const point = new Point(event.offsetX, event.offsetY);
    const lastPoint = points[points.length-1];
    const isLastPointTooClose =
    lastPoint && point.distanceTo(lastPoint) < minDistanceBetweenPoints;
    let newVelocity: number = velocity;
    let newWidth: number = width;
    // // Skip if point is too close to lastPoint.
    if (!(lastPoint && isLastPointTooClose)) {

      points.push(point);

      let { curve, widths }  = addPointToCurve(point, points, velocity, width, this.options.minWidth, this.options.maxWidth);

      newVelocity = widths.velocity;
      newWidth = widths.end;

      if (curve) {
        ctx = drawCurve(ctx, curve, widths.start, widths.end);
      }
    }

    newState = {
      ...newState,
      ctx,
      points,
      velocity: newVelocity,
      width: newWidth

    };

    this.state = newState;
  }
}



