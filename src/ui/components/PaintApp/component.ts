
import Component, { tracked } from '@glimmer/component';

export interface PaintState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  position: Object;
  brushOn: Boolean;
}

export default class PaintApp extends Component {
  @tracked state: PaintState;
  reset: PaintState; // initial state

  didInsertElement() {
    let canvas = <HTMLCanvasElement> (this.bounds.firstNode as HTMLElement).querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let position = {x:0, y:0};
    this.reset = {
      ...this.reset,
      canvas,
      ctx,
      position,
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
    let {ctx, position} = state;
    ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
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
        if (state.brushOn) {
          ctx.lineTo(cmd.payload.x, cmd.payload.y);
          ctx.stroke()
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
