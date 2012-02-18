var width = c.width = window.innerWidth;
var height = c.height = window.innerHeight;
var mX = width/2;
var mY = height*.4;
var mZ = 500;
var rY = 0;
var heart_pts = [];
var max_points_out = 250;
var points_out = [];
M = Math;
function heart_curve(t) {
  return {
    x: width/6 * M.pow(M.sin(t), 3),
    y: height/-60 * (15*M.cos(t) - 5 * M.cos(2*t) - 2 * M.cos(3*t) - M.cos(4 * t)),
    z: 0
  };
}
function random(max) {
  return M.floor(M.random()*max);
}
function copy(p) {
  var newObj = {};
  for (i in p) {
    newObj[i] = p[i];
  }
  return newObj;
}
function rotate(p) {
  var x = p.x;
  p.x=M.cos(rY)*x + M.sin(rY)*p.z;
  p.z=-M.sin(rY)*x + M.cos(rY)*p.z;
  return p;
}
function point(p) {
  var pt = copy(p);
  rotate(pt);
  pt.x = mX+pt.x*mZ/(pt.z+mZ);
  pt.y = mY+pt.y*mZ/(pt.z+mZ);
  return pt;
}
function move_point(p) {
  p.y += 2;
  if (p.y > p.to.y) return 0;
  return 1;
}
function draw(p) {
  a.fillStyle=p.c;
  a.beginPath();
  a.arc(p.x, p.y, 4, 0, M.PI*2, 1);
  a.closePath();
  a.fill();
}
function create_point(from, to) {
  return {
    x: from.x,
    y: from.y,
    z: from.z,
    to: to,
    c: "hsl("+random(361)+","+random(101)+"%,"+random(50)+"%)"
  };
}
for (var t = -M.PI/2; t < M.PI/2; t+=M.PI*.01) {
  if (t < -.25 || t > .25)
    heart_pts.push({t: heart_curve(t), b: heart_curve(t+M.PI)});
}
setInterval(function () {
  a.fillStyle = "rgba(0,0,0,0.15)";
  a.fillRect(0, 0, width, height);
  if (points_out.length < max_points_out) {
    loc = random(heart_pts.length);
    points_out.push(create_point(heart_pts[loc].t, heart_pts[loc].b));
    loc = random(heart_pts.length);
    points_out.push(create_point(heart_pts[loc].t, heart_pts[loc].b));
  }
  for (var i = 0; i < points_out.length; i++) {
    var pt = points_out[i];
    if (!move_point(pt)) {
      points_out.splice(i, 1);
    } else {
      draw(point(pt));
    }
  }
  rY += .02;
}, 30);
