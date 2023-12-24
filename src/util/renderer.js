import Vector from "../math/vector.js";
import Line from "../math/line.js";
import PointMass from "../dynamic/pointmass.js";
import Graphic from "../util/graphic.js";
import Container from "../dynamic/container.js";

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = true;

    this.offset = new Vector(0, 0);
    this.w = canvas.width;
    this.h = canvas.height;
    canvas.addEventListener("resize", () => {
      this.w = canvas.width;
      this.h = canvas.height;
    });
  }

  setBackgroundColor(color) {
    this.canvas.style.backgroundColor = color;
  }

  setStrokeColor(color) {
    this.ctx.strokeStyle = color;
    return this;
  }
  setFillColor(color) {
    this.ctx.fillStyle = color;
    return this;
  }

  fill() {
    this.ctx.fill();
    return this;
  }
  stroke() {
    this.ctx.stroke();
    return this;
  }

  drawCircle({ x = 250, y = 250 }, r = 100) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    return this;
  }

  drawRect({ x, y }, w = 100, h = 100) {
    this.ctx.rect(x, y, w, h);
    return this;
  }

  drawPolygon(points) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();
    return this;
  }

  drawLine({ x: x1 = 100, y: y1 = 100 }, { x: x2 = 200, y: y2 = 200 }) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this;
  }

  drawText(text, { x = 0, y = 0 }, font = "16px sans-serif") {
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  draw(thing, options = {}) {
    if (thing instanceof Vector) {
      this.drawVector(thing, options);
    } else if (thing instanceof Line) {
      this.drawLine(thing.pointWithX(0), thing.pointWithX(this.w));
    } else if (thing instanceof PointMass) {
      this.drawCircle(thing.position, 5);
      this.renderGraphic(thing.graphic);
    } else if (thing instanceof Container) {
      this.drawRect(thing.offset, thing.corner.x, thing.corner.y);
      this.renderGraphic(thing.graphic);
    }
    return this;
  }

  renderGraphic(graphic){
    if (graphic.is_fill) {
      this.ctx.fillStyle = graphic.fill_color;
      this.fill();
    } 

    if (graphic.is_stroke) {
      this.ctx.strokeStyle = graphic.stroke_color;
      this.ctx.lineWidth = graphic.stroke_width;
      this.stroke();
    }
  }

  drawVector(vector, { origin = new Vector(0, 0) }) {
    this.drawLine(origin, origin.add(vector));
    let tip = vector.norm().mul(-10).add(vector);
    let left = tip.rot(135).mul(0.5);
    let right = tip.rot(-135).mul(0.5);
    this.drawLine(tip, tip.add(left));
    this.drawLine(tip, tip.add(right));
  }

  loop(callback) {
    let last = 0;
    let loop = (time) => {
      let dt = time - last;
      last = time;
      callback(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
