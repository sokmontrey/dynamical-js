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
    this.pointmasses.filter((pm) => {
      return pm.position.x < this.offset.x ||
        pm.position.x > -this.offset.x + this.corner.x ||
        pm.position.y < this.offset.y ||
        pm.position.y > -this.offset.y + this.corner.y;
    }).forEach((pm) => {
      pm.position = Vector.min(
        Vector.max(pm.position, this.offset),
        this.corner.sub(this.offset),
      );
      pm.setVelocity(pm.getVelocity().mul(0.1));
    });
  }
}
