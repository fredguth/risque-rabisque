
import Component, { tracked } from '@glimmer/component';
import { distanceBetween2Points, middlePointBetween, angleBetween2Points} from '../../../utils/trig';

export interface PaintState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  undoCtx: CanvasRenderingContext2D;
  position: Object;
  brush: HTMLImageElement;
  brushOn: Boolean;
  linePoints: Array;
}

export default class PaintApp extends Component {
  @tracked state: PaintState;
  reset: PaintState; // initial state

  didInsertElement() {
    let canvas = <HTMLCanvasElement> (this.bounds.firstNode as HTMLElement).querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let undoCtx = ctx;
    let background = new Image();
    // background.src = "https://mags.clubeami.com.br/357/files/assets/common/page-html5-substrates/page0003.jpg";
    // background.onload = () => {
    //   canvas.width = background.width;
    //   canvas.height = background.height;
    //   ctx.drawImage(background, 0,0);
    // }
    let brush = new Image();
    brush.src = 'brush_ps16.png';
    let position = {x:0, y:0};
    this.reset = {
      ...this.reset,
      canvas,
      ctx,
      undoCtx,
      position,
      brush,
      brushOn: false,
      linePoints:[]
    };

    this.state = this.reset;
  }
  mouseAction(event) {
    let cmd = {
      type: event.type,
      payload: {x:event.offsetX, y:event.offsetY}
    }
    //console.log(`fn: debounce = ${debounce}`);
    this.update(this.state, cmd);
  }

  drawLine(ctx, points ){

    // references:
    // http://perfectionkills.com/exploring-canvas-drawing-techniques/
    // http://www.tricedesigns.com/2012/01/04/sketching-with-html5-canvas-and-brush-images/
    //
    // simple line:
    // ctx.lineTo(cmd.payload.x, cmd.payload.y);
    // ctx.stroke();
    //
    // brush:
    // let halfBrushW = brush.width/2;
    // let halfBrushH = brush.height/2;
    // let distance = parseInt(distanceBetween2Points(position, cmd.payload));
    // let angle = angleBetween2Points(position, cmd.payload);
    // let x, y, z:number = -1;
    // for (z=0; (z<=distance||z==0); z++) {
    //   x = position.x + (Math.sin(angle) * z) - halfBrushW;
    //   y = position.y + (Math.cos(angle) * z) - halfBrushH;
    //   ctx.drawImage(brush, x, y);
    // }
    //
    // qudratic curve:

    // let distance = parseInt(distanceBetween2Points(p1, p2));
    // let angle = angleBetween2Points(p1, p2);
    // let midPoint = {
    //   x: p1.x + (Math.sin(angle) * distance),
    //   y: p1.y + (Math.cos(angle) * distance)
    // };
    //
    ctx.moveTo(points[0].x, points[0].y);
    console.log('moveTo:${points[0].x}, ${points[0].y}');
    let midPoint;
    let i;

    for (i=1; i < points.length - 2; i++) {
      if (points[i+1]) {
        midPoint = {
        x: (points[i].x + points[i+1].x) / 2,
        y: (points[i].y + points[i+1].y) / 2,
      }
      ctx.quadraticCurveTo(points[i].x, points[i].y, midPoint.x, midPoint.y);
      }
    }
    points[i+1] && ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
    ctx.stroke();
    return ctx;
  }

  update(state, cmd) {
    let newState:PaintState = state;
    let { ctx, position, brush, linePoints, undoCtx } = state;
    ctx);

    ctx.moveTo(position.x, position.y);
    newState = {
      ...newState,
      ctx
    }

    switch (cmd.type) {
      case 'mousedown': {

        undoCtx = ctx;
        ctx.strokeStyle = "#df4b26";
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 10;
        ctx.beginPath();
        newState = {
         ...newState,
         ctx,
         brushOn: true,
         position:cmd.payload,
         linePoints: [cmd.payload],
         undoCtx
        }

        break;
      }
      case 'mouseup': {
        undoCtx = ctx;
        newState = {
         ...newState,
         brushOn: false,
         position:cmd.payload,
         undoCtx
        }
        break;
      }
      case 'mousemove': {

        let fixed = (cmd.payload.x == position.x && cmd.payload.y == position.y);

        if (state.brushOn && !fixed) {

          linePoints.push(cmd.payload);

          newState = {
            ...newState,
            ctx: this.drawLine(undoCtx, linePoints)
          }

        }
        break
      }
    }
    //return newState;
    this.state = newState;
  }


}
