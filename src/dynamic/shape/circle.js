import { PointMass, Shape, ShapeGraphic } from "../../index.js";

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

  static fromVector(pos, radius) {
    return new Circle(pos, radius);
  }

  getPosition() {
    return this.pointmasses[0].position;
  }

  getVelocity() {
    return this.pointmasses[0].getVelocity();
  }

  setVelocity(velocity) {
    this.pointmasses[0].setVelocity(velocity);
    return this;
  }

  rotateBy() {
    throw new Error("Circle: rotateBy() is not supported");
  }
  updateEdges() {
    throw new Error("Circle: updateEdges() is not supported");
  }
  updateSupports() {
    throw new Error("Circle: updateSupports() is not supported");
  }
  updateJoints() {
    throw new Error("Circle: updateJoints() is not supported");
  }

  applyForce(force) {
    this.pointmasses[0].applyForce(force);
  }

  updatePointMasses(dt = 0.25, step = 1) {
    this.pointmasses[0].update(dt, step);
    return this;
  }

  update(dt = 0.25, step = 1) {
    this.updatePointMasses(dt, step);
    return this;
  }

  getEdges() {
    throw new Error("Circle: getEdges() is not supported");
  }

  getSupports() {
    throw new Error("Circle: getSupports() is not supported");
  }

  getJoints() {
    throw new Error("Circle: getJoints() is not supported");
  }

  getPointMasses() {
    return this.pointmasses;
  }

  getBoundingBox() {
    const p = this.pointmasses[0].position;
    return [
      new Vector(
        p.x - this.radius,
        p.y - this.radius,
      ),
      new Vector(
        p.x + this.radius,
        p.y + this.radius,
      ),
    ];
  }
}
