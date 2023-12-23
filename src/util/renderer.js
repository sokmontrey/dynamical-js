import Vector from './vector.js'

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.ctx.imageSmoothingEnabled = true;

    this.w = canvas.width;
    this.h = canvas.height;
    canvas.addEventListener('resize', () => {
      this.w = canvas.width;
      this.h = canvas.height;
    });
  }

  setBackgroundColor(color) {
    this.canvas.style.backgroundColor = color;
  }

  setStrokeColor(color) {
    this.ctx.strokeStyle = color;
  }
  setFillColor(color) {
    this.ctx.fillStyle = color;
  }

  circle({x=250, y=250}, r=100) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  rect({x,y}, w=100, h=100) {
    this.ctx.fillRect(x, y, w, h);
  }

  polygon(points) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  line({x:x1=100, y:y1=100}, {x:x2=200, y:y2=200}) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  text(text, {x=0, y=0}, font='16px sans-serif') {
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loop(callback) {
    let last = 0;
    let loop = (time) => {
      let dt = time - last;
      last = time;
      callback(dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

}
