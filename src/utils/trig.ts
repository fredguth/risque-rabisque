export function distanceBetween2Points ( point1, point2 ) {

  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;
  return Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) );
}

export function middlePointBetween( point1, point2 ) {
  return {
    x: point1.x + (point2.x - point1.x) / 2,
    y: point1.y + (point2.y - point1.y) / 2
  };
}

export function angleBetween2Points ( point1, point2 ) {

  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;
  return Math.atan2( dx, dy );
}

