import { Container, DynError, Graphic, Vector } from "../../index.js";

export default class CircleContainer extends Container {
  constructor(points = [], radius = 250, center = new Vector(250, 250)) {
    super(points);

    DynError.throwIfNotNumber(radius, "CircleContainer: radius");
    DynError.throwIfNotType(center, Vector, "CircleContainer: center");

    this.radius = radius;
    this.center = center;

    this.graphic = new Graphic("white", "gray")
      .setStrokeWidth(2)
      .noFill()
      .stroke();
  }
  draw(renderer) {
    renderer.drawCircle(this.offset, this.radius);
    renderer.renderGraphic(this.graphic);
  }

  _updatePointMasses() {
    for (let i = 0; i < this.pointmasses.length; i++) {
      const pm = this.pointmasses[i];
      const dist = pm.position.sub(this.center);
      if (dist.mag() <= this.radius) continue;
      const new_vel = pm.getVelocity()
        .reflect(dist.norm())
        .mul(1 - this.friction);
      pm.position = pm.position.sub(this.center)
        .scale(this.radius)
        .add(this.center);
      pm.setVelocity(new_vel);
    }
  }
  _updateCircle() {
    for (let i = 0; i < this.circles.length; i++) {
      const c = this.circles[i];
      const dist = c.getPosition().sub(this.center);
      if (dist.mag() + c.radius <= this.radius) continue;
      const dir = dist.norm();
      const new_vel = c.getVelocity()
        .reflect(dir)
        .mul(1 - this.friction * 0.01);
      c.setPosition(this.center.add(dir.scale(this.radius - c.radius)));
      c.setVelocity(new_vel);
    }
  }
}
