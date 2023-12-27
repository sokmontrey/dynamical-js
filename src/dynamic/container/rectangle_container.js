import { Container, DynError, Graphic, Vector } from "../../index.js";

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
  }
  draw(renderer) {
    renderer.drawRect(this.offset, this.corner.x, this.corner.y);
    renderer.renderGraphic(this.graphic);
  }

  _updatePointMasses() {
    for (let i = 0; i < this.pointmasses.length; i++) {
      const pm = this.pointmasses[i];
      const offset_pm = pm.position.sub(this.offset);

      const norm = new Vector(0, 0);
      if (offset_pm.x <= 0) norm.x = 1;
      else if (offset_pm.x >= this.corner.x) norm.x = -1;
      else if (offset_pm.y <= 0) norm.y = 1;
      else if (offset_pm.y >= this.corner.y) norm.y = -1;
      else continue;

      const new_vel = pm.getVelocity().reflect(norm).mul(1 - this.friction);
      pm.setPosition(Vector.clamp(pm.position, this.offset, this.corner));
      pm.setVelocity(new_vel);
    }
  }

  _updateCircle() {
    for (let i = 0; i < this.circles.length; i++) {
      const c = this.circles[i];
      const offset_c = c.getPosition().sub(this.offset);

      const norm = new Vector(0, 0);
      if (offset_c.x - c.radius <= 0) norm.x = 1;
      else if (offset_c.x + c.radius >= this.corner.x) norm.x = -1;
      else if (offset_c.y - c.radius <= 0) norm.y = 1;
      else if (offset_c.y + c.radius >= this.corner.y) norm.y = -1;
      else continue;

      const new_vel = c.getVelocity().reflect(norm).mul(
        1 - this.friction * 0.01,
      );
      c.setPosition(
        Vector.clamp(
          c.getPosition(),
          this.offset.add(Vector.numToVec(c.radius)),
          this.corner.sub(Vector.numToVec(c.radius)),
        ),
      );
      c.setVelocity(new_vel);
    }
  }
}
