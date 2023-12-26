import { Container, DynError, Graphic, Vector } from "../../../index.js";

export default class RectContainer extends Container {
  constructor(points = [], x = 0, y = 0, w = 500, h = 500) {
    super(points);

    DynError.throwIfNotNumber(x, "Container: x");
    DynError.throwIfNotNumber(y, "Container: y");
    DynError.throwIfNotNumber(w, "Container: w");
    DynError.throwIfNotNumber(h, "Container: h");

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

  update() {
    this.pointmasses.filter((point) => {
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
