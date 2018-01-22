export const throttle = (fn, limit) => {
   fn.apply(this, arguments);
  // let inThrottle = false;
  // if (!inThrottle) {
  //   fn.apply(this, arguments);
  //   inThrottle = true;
  //   setTimeout(()=> inThrottle = false, limit);
  // }
  // return function() {
  //   console.log('throttle');
  //   // if (!inThrottle) {
  //   //   console.log(`this:${this}, args:${arguments}`);
  //   //   fn.apply(this, arguments)
  //   //   inThrottle = true
  //   //   setTimeout(() => inThrottle = false, limit)
  //   // }
  // }
}