import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class Container {
  constructor(points = [], x = 0, y = 0, w = 500, h = 500) {
    this.offset = new Vector(x, y);
    this.corner = new Vector(x + w, y + h);

    this.points = points;
    this.graphic = new Graphic("white", "gray")
      .setStrokeWidth(2)
      .setStrokeColor("gray")
      .noFill()
      .stroke();
  }

  addPoint(point) {
    this.points.push(point);
    return this;
  }

  update() {
    this.points.filter((point) => {
      return point.position.x < this.offset.x ||
        point.position.x > this.offset.x + this.corner.x ||
        point.position.y < this.offset.y ||
        point.position.y > this.offset.y + this.corner.y;
    }).forEach((point) => {
      point.position = Vector.min(
        Vector.max(point.position, this.offset),
        this.corner,
      );
    });
  }
}