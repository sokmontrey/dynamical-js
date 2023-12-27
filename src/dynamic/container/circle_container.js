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

  update() {
    const collided = this.pointmasses.filter((pm) => {
      return Vector.dist(pm.position, this.center) > this.radius;
    });
    for (let i = 0; i < collided.length; i++) {
      const pm = collided[i];
      pm.position = pm.position.sub(this.center)
        .scale(this.radius)
        .add(this.center);
      pm.setVelocity(pm.getVelocity().mul(0.0));
    }
  }
}
