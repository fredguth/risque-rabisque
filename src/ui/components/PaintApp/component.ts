
import Component, { tracked } from '@glimmer/component';
import { distanceBetween2Points, angleBetween2Points} from '../../../utils/trig';

export interface PaintState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  position: Object;
  brush: HTMLImageElement;
  brushOn: Boolean;
}

export default class PaintApp extends Component {
  @tracked state: PaintState;
  reset: PaintState; // initial state

  didInsertElement() {
    let canvas = <HTMLCanvasElement> (this.bounds.firstNode as HTMLElement).querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let brush = new Image();
    brush.src = 'brush_ps16.png';
    let position = {x:0, y:0};
    this.reset = {
      ...this.reset,
      canvas,
      ctx,
      position,
      brush,
      brushOn: false
    };

    this.state = this.reset;
  }
  mouseAction(event) {
    let cmd = {
      type: event.type,
      payload: {x:event.offsetX, y:event.offsetY}
    }
    // console.log(cmd);
    this.update(this.state, cmd);
  }

  update(state, cmd) {
    let newState:PaintState = state;
    let { ctx, position, brush } = state;
    ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.moveTo(position.x, position.y);
    newState = {
         ...newState,
         ctx,
         position: cmd.payload
    }

    switch (cmd.type) {
      case 'mousedown': {
        newState = {
         ...newState,
         brushOn: true
        }
        break;
      }
      case 'mouseup': {
        newState = {
         ...newState,
         brushOn: false
        }
        break;
      }
      case 'mousemove': {
        // http://www.tricedesigns.com/2012/01/04/sketching-with-html5-canvas-and-brush-images/
        //
        if (state.brushOn) {
          // ctx.lineTo(cmd.payload.x, cmd.payload.y);
          // ctx.stroke();
          let halfBrushW = brush.width/2;
          let halfBrushH = brush.height/2;
          let distance = parseInt(distanceBetween2Points(position, cmd.payload));
          let angle = angleBetween2Points(position, cmd.payload);
          let x, y, z:number = -1;
          for (z=0; (z<=distance||z==0); z++) {
            x = position.x + (Math.sin(angle) * z) - halfBrushW;
            y = position.y + (Math.cos(angle) * z) - halfBrushH;
            ctx.drawImage(brush, x, y);
          }
          newState = {
            ...newState,
            ctx
          }
        }
        break
      }
    }
    //return newState;
    this.state = newState;
  }


}
