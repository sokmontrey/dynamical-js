import { Container, DynError, Graphic, Vector } from "../../../index.js";

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
    this.graphic.draw = (renderer) => {
      renderer.drawCircle(this.offset, this.radius);
      renderer.renderGraphic(this.graphic);
    };
  }

  update() {
    this.pointmasses.filter((point) => {
      return Vector.dist(point.position, this.center) > this.radius;
    }).forEach((point) => {
      point.position = point.position.sub(this.center)
        .scale(this.radius)
        .add(this.center);
      point.velocity = new Vector(0, 0);
    });
  }
}
