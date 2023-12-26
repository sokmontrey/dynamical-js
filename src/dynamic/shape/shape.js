import {
  AngleConstraint,
  DistanceConstraint,
  DynArray,
  DynError,
  PointMass,
  ShapeGraphic,
  Vector,
} from "../../../index.js";

export default class Shape {
  constructor(pointmasses = [], is_optimized_joints = false) {
    pointmasses.every((pointmass) => {
      DynError.throwIfNotType(pointmass, PointMass, "Shape: pointmasses");
    });
    DynError.throwIfEmpty(pointmasses, "Shape: vertices");
    DynError.throwIfUndefined(
      is_optimized_joints,
      "Shape: is_optimized_joints",
    );

    this.pointmasses = pointmasses;
    this.distance_constraint = [];
    this.angle_constraints = [];

    this.is_optimized_joints = is_optimized_joints;

    this._createEdges();
    this._createJoints();

    this.graphic = new ShapeGraphic("#faf887", "#a0f080")
      .noWireframe()
      .noDistanceConstraints()
      .noVertices()
      .noJoints()
      .noCenterOfMass("#ff5555");
    this.graphic.draw = (renderer) => {
      renderer.drawPolygon(this.pointmasses.map((pm) => pm.position));
      renderer.renderGraphic(this.graphic);
      if (this.graphic.is_distance_constraints) {
        this.distance_constraints.forEach((dc) => dc.graphic.draw(renderer));
      }
      if (this.graphic.is_vertices) {
        this.pointmasses.forEach((pm) => pm.graphic.draw(renderer));
      }
      if (this.graphic.is_joints) {
        this.angle_constraints.forEach((ac) => ac.graphic.draw(renderer));
      }
      if (this.graphic.is_center_of_mass) {
        renderer.drawCircle(this.getCenterOfMass(), 5)
          .setFillColor(this.graphic.cener_of_mass_color)
          .fill();
      }
    };
  }

  static fromVertices(
    relative_vertices = [],
    offset = new Vector(250, 250),
    options = {},
  ) {
    DynError.throwIfEmpty(relative_vertices, "Shape: vectors");
    relative_vertices.every((vertex) => {
      DynError.throwIfNotType(vertex, Vector, "Shape: vertices");
    });
    return new Shape(
      relative_vertices.map((vertex) => new PointMass(vertex)),
      ...Object.values(options),
    ).setPosition(offset);
  }

  static fromSides(
    sides = 3,
    radius = 40,
    offset = new Vector(250, 250),
    options = {},
  ) {
    return Shape.fromVertices(
      [...Array(sides).keys()]
        .map((i) =>
          new Vector(
            radius * Math.cos(i * 2 * Math.PI / sides),
            radius * Math.sin(i * 2 * Math.PI / sides),
          )
        ),
      offset,
      options,
    );
  }

  // doesn't reserve velocity
  setPosition(position) {
    const center = this.getCenterOfMass();
    this.pointmasses.forEach((pm) => {
      pm.setPosition(position.add(pm.position.sub(center)));
    });
    return this;
  }

  getPosition() {
    return this.getCenterOfMass();
  }

  setVelocity(velocity) {
    this.pointmasses.forEach((pm) => pm.setVelocity(velocity));
    return this;
  }

  applyForce(force) {
    this.pointmasses.forEach((pm) => pm.applyForce(force));
    return this;
  }

  // reserve velocity
  rotateBy(angle, center = this.getCenterOfMass()) {
    this.pointmasses.forEach((pm) => {
      const center_to_pm = pm.position.sub(center);
      pm.addPosCorrection(
        center_to_pm.rot(angle).sub(center_to_pm),
      );
    });
    return this;
  }

  _createEdges() {
    this.distance_constraints = DynArray.pairReduce(
      this.pointmasses,
      (acc, pm1, pm2) => {
        acc.push(new DistanceConstraint(pm1, pm2));
        return acc;
      },
      [],
    );
  }

  _createJoints() {
    this.angle_constraints = DynArray.pairReduce(
      this.distance_constraints,
      (acc, dc1, dc2, i) => {
        if (!this.is_optimized_joints || i % 2 === 0) {
          acc.push(new AngleConstraint(dc1, dc2));
        }
        return acc;
      },
      [],
    );
  }

  applyForce(force) {
    this.pointmasses.forEach((pointmass) => pointmass.applyForce(force));
  }

  updatePointMasses(dt = 0.25, step = 1) {
    this.pointmasses.forEach((pointmass) => pointmass.update(dt, step));
  }

  updateDistanceConstraints(step = 1) {
    this.distance_constraints.forEach((dc) => dc.update(step));
  }

  updateAngleConstraints(step = 1) {
    this.angle_constraints.forEach((ac) => ac.update(step));
  }

  update(dt = 0.25, step = 1) {
    this.updateDistanceConstraints(step);
    this.updateAngleConstraints(step);
    this.updatePointMasses(dt, step);
  }

  getPointMasses() {
    return this.pointmasses;
  }
  getDistanceConstraints() {
    return this.distance_constraints;
  }
  getAngleConstraints() {
    return this.angle_constraints;
  }
  // assume that all pointmasses have the same mass
  getCenterOfMass() {
    return this.pointmasses.reduce(
      (acc, pm) => acc.add(pm.position),
      new Vector(0, 0),
    ).div(this.pointmasses.length);
  }
}
