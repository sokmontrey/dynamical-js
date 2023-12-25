import Vector from "../math/vector.js";
import Line from "../math/line.js";
import PointMass from "../dynamic/pointmass.js";
// import Graphic from "../util/graphic.js";
import DistanceConstraint from "../dynamic/distance_constraint.js";
import Container, { CircleContainer } from "../dynamic/container.js";
import AngleConstraint from "../dynamic/angle_constraint.js";
import { throwIfNotType } from "../util/error.js";

export default class Renderer {
  constructor(canvas) {
    throwIfNotType(canvas, HTMLCanvasElement, "Renderer: canvas");

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

  drawCircle(pos = new Vector(250, 250), r = 100) {
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
    return this;
  }

  drawPie(pos = new Vector(250, 250), r = 100, start = 0, end = 2 * Math.PI) {
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, r, start, end);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.closePath();
    return this;
  }

  drawRect(pos = new Vector(250, 250), w = 100, h = 100) {
    this.ctx.rect(pos.x, pos.y, w, h);
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

  drawLine(start = new Vector(100, 100), end = new Vector(200, 200)) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    return this;
  }

  drawText(text, pos = new Vector(250, 250), font = "16px sans-serif") {
    this.ctx.font = font;
    this.ctx.fillText(text, pos.x, pos.y);
    return this;
  }

  drawVector(
    vector,
    origin = new Vector(0, 0),
    color = "#ff5555",
    tip_size = 10,
  ) {
    this.setStrokeColor(color);
    this.drawLine(origin, origin.add(vector)).stroke();
    const tip = origin.add(vector);
    const angle = vector.angle();
    const left = new Vector(0, tip_size).rot(angle + 60);
    const right = new Vector(0, tip_size).rot(angle - 240);
    this.drawLine(tip, tip.add(left)).stroke();
    this.drawLine(tip, tip.add(right)).stroke();
    return this;
  }

  draw(thing, options = {}) {
    if (thing.graphic && !thing.graphic.isVisible()) return this;

    if (thing instanceof Vector) {
      this.drawVector(thing, ...Object.values(options));
    } else if (thing instanceof Line) {
      this.drawLine(thing.pointWithX(0), thing.pointWithX(this.w));
    } else if (thing instanceof PointMass) {
      this.drawCircle(thing.position, 5);
      this.renderGraphic(thing.graphic);
    } else if (thing instanceof CircleContainer) {
      this.drawCircle(thing.center, thing.radius);
      this.renderGraphic(thing.graphic);
    } else if (thing instanceof Container) {
      this.drawRect(thing.offset, thing.corner.x, thing.corner.y);
      this.renderGraphic(thing.graphic);
    } else if (thing instanceof DistanceConstraint) {
      this.drawLine(thing.pointmass1.position, thing.pointmass2.position);
      this.renderGraphic(thing.graphic);
    } else if (thing instanceof AngleConstraint) {
      const start = thing.pointmass1.position.sub(thing.pointmass2.position)
        .angle();
      const end = thing.pointmass3.position.sub(thing.pointmass2.position)
        .angle();
      this.drawPie(
        thing.pointmass2.position,
        thing.graphic.size,
        end * Math.PI / 180,
        start * Math.PI / 180,
      );
      this.renderGraphic(thing.graphic);
    }

    return this;
  }

  renderGraphic(graphic) {
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

  moveCameraBy(vector) {
    this.ctx.translate(-vector.x, -vector.y);
    this.offset = this.offset.offset(vector);
    return this;
  }

  moveCameraTo(vector) {
    this.ctx.translate(-vector.x + this.offset.x, -vector.y + this.offset.y);
    this.offset = vector;
    return this;
  }

  moveCameraCenterTo(vector) {
    this.moveCameraTo(vector.sub(new Vector(this.w / 2, this.h / 2)));
    return this;
  }

  clear() {
    this.ctx.clearRect(this.offset.x, this.offset.y, this.w, this.h);
    return this;
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
