import Component, { tracked } from '@glimmer/component';
export default class extends Component {
  mouseDown(event) {
     console.log(`${event.type}`);
  }
  mouseMove(event) {
    console.log(`${event.type}`);
  }
  mouseUp(event) {
    console.log(`${event.type}`);
  }
}
// import Component, { tracked } from '@glimmer/component';

// export interface PaintState {
//   canvas: HTMLCanvasElement;
//   ctx: CanvasRenderingContext2D;
// }

// export default class PaintApp extends Component {
//   @tracked state: PaintState;
//   reset: PaintState; // initial state

//   didInsertElement() {
//     let canvas = <HTMLCanvasElement> (this.bounds.firstNode as HTMLElement).querySelector('canvas');
//     let ctx = canvas.getContext('2d');
//     canvas.addEventListener('mousedown', this.mouseDown);
//     canvas.addEventListener('mouseup', this.mouseUp);
//     canvas.addEventListener('mousemove', this.mouseMove);
//     this.reset = {
//       ...this.reset,
//       canvas,
//       ctx
//     }
//   }
//   willDestroy(){
//     // this.reset.canvas.removeEventListener('mousedown', this.mouseDown);
//     // this.reset.canvas.removeEventListener('mouseup', this.mouseUp);
//     // this.reset.canvas.removeEventListener('mousemove', this.mouseMove);
//   }
//   mouseDown(event) {
//      console.log(`${event.type}`);
//      // update(this.state, {type: 'mousedown'})
//   }
//   mouseMove(event) {
//     //console.log(`move:${event.offsetX}, ${event.offsetY}`);
//     console.log(`${event.type}`);
//   }
//   mouseUp(event) {
//     console.log(`${event.type}`);
//   }
//   update(state, cmd) {
//     let newState:PaintState = this.state | this.reset;

//     return newState;
//   }


// }
