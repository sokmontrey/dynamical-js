import {
  throwIfEmpty,
  throwIfNotNumber,
  throwIfNotType,
} from "../util/error.js";
import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";
import Pointmass from "./pointmass.js";

export default class Container {
  constructor(points = [], x = 0, y = 0, w = 500, h = 500) {
    throwIfEmpty(points, "Container: points");
    points.every((point) => {
      throwIfNotType(point, Pointmass, "Container: points");
    });
    throwIfNotNumber(x, "Container: x");
    throwIfNotNumber(y, "Container: y");
    throwIfNotNumber(w, "Container: w");
    throwIfNotNumber(h, "Container: h");

    this.points = points;
    this.offset = new Vector(x, y);
    this.corner = new Vector(x + w, y + h);

    this.graphic = new Graphic("white", "gray")
      .setStrokeWidth(2)
      .noFill()
      .stroke();
    this.graphic.draw = (renderer) => {
      renderer.drawRect(this.offset, w, h);
      renderer.renderGraphic(this.graphic);
    };
  }

  addPoint(point) {
    throwIfNotType(point, Pointmass, "Container: addPoint: point");
    this.points.push(point);
    return this;
  }

  update() {
    this.points.filter((point) => {
      return point.position.x < this.offset.x ||
        point.position.x > -this.offset.x + this.corner.x ||
        point.position.y < this.offset.y ||
        point.position.y > -this.offset.y + this.corner.y;
    }).forEach((point) => {
      point.position = Vector.min(
        Vector.max(point.position, this.offset),
        this.corner.sub(this.offset),
      );
      point.velocity = new Vector(0, 0);
    });
  }
}

export class CircleContainer {
  constructor(points = [], radius = 250, center = new Vector(250, 250)) {
    throwIfEmpty(points, "CircleContainer: points");
    points.every((point) => {
      throwIfNotType(point, Pointmass, "CircleContainer: points");
    });
    throwIfNotNumber(radius, "CircleContainer: radius");
    throwIfNotType(center, Vector, "CircleContainer: center");

    this.points = points;
    this.radius = radius;
    this.center = center;

    this.graphic = new Graphic("white", "gray")
      .setStrokeWidth(2)
      .noFill()
      .stroke();
    this.graphic.draw = (renderer) => {
      renderer.drawCircle(this.offset, this.radius);
      renderer.renderGraphic(this.graphic);
    };
  }

  addPoint(point) {
    throwIfNotType(point, Pointmass, "CircleContainer: addPoint: point");
    this.points.push(point);
    return this;
  }

  update() {
    this.points.filter((point) => {
      return Vector.dist(point.position, this.center) > this.radius;
    }).forEach((point) => {
      point.position = point.position.sub(this.center)
        .scale(this.radius)
        .add(this.center);
      point.velocity = new Vector(0, 0);
    });
  }
}
