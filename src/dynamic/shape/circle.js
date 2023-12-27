import { PointMass, Shape, ShapeGraphic} from "../../index.js";

export default class Circle extends Shape {
  constructor(pos, radius) {
    const pm = new PointMass(pos);
    super([pm], false, false, false);

    this.radius = radius;

    this.graphic = new ShapeGraphic("#aaff55", "gray")
      .noWireframe()
      .noDistanceConstraints()
      .noVertices()
      .noJoints()
      .noBoundingBox()
      .noCenterOfMass("#ff5555");
  }

  draw(renderer) {
    renderer.drawCircle(this.pointmasses[0].position, this.radius);
    renderer.renderGraphic(this.graphic);
    this.graphic.renderShape(renderer, this);
  }

  getPosition() {
    return this.pointmasses[0].position;
  }

  getVelocity() {
    return this.pointmasses[0].getVelocity();
  }
}
