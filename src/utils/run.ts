export const throttle = function (fn, period, opts) {
  opts = opts || {};
  var leading = opts.leading === false ? false : true; // defaults to true
  var trailing = !!opts.trailing; // defaults to false
  var args, cached;
  var timeout = null, prev = 0;


  return function() {
    var now = Date.now();
    if (!leading && !prev) prev = now;
    var timeLeft = period - (now - prev);
    args = [];
    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]); // faster slice
    if (timeLeft <= 0 || timeLeft > period) {
      clear();
      prev = now;
      cached = fn.apply(this, args);
      if (!timeout) args = null;
    } else if (!timeout && trailing) {
      timeout = setTimeout(deferred.bind(this), timeLeft);
    }
    return cached;
  };

  function clear() {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  }

  function deferred() {
    prev = leading ? Date.now() : 0;
    timeout = null;
    cached = fn.apply(this, args);
    if (!timeout) args = null;
  }
}