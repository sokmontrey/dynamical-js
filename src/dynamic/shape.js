import { throwIfEmpty } from "../util/error.js";
import Vector from "../math/vector.js";
import DistanceConstraint from "./distance_constraint.js";
import AngleConstraint from "./angle_constraint.js";
import PointMass from "./pointmass.js";
import { ShapeGraphic } from "../util/graphic.js";
import { throwIfNotType, throwIfUndefined } from "../util/error.js";
import { pairReduce } from "../util/array.js";

export default class Shape {
  constructor(pointmasses = [], is_optimized_joints = false) {
    pointmasses.every((pointmass) => {
      throwIfNotType(pointmass, PointMass, "Shape: pointmasses");
    });
    throwIfEmpty(pointmasses, "Shape: vertices");
    throwIfUndefined(is_optimized_joints, "Shape: is_optimized_joints");

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
      .noJoints();
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
    };
  }

  static fromVertices(
    relative_vertices = [],
    offset = new Vector(250, 250),
    options = {},
  ) {
    throwIfEmpty(relative_vertices, "Shape: vectors");
    relative_vertices.every((vertex) => {
      throwIfNotType(vertex, Vector, "Shape: vertices");
    });
    return new Shape(
      relative_vertices.map((vertex) => new PointMass(vertex)),
      ...Object.values(options),
    ).moveBy(offset);
  }

  moveBy(offset) {
    throwIfNotType(offset, Vector, "Shape: offset");
    this.pointmasses.forEach((pm) => pm.setPosition(pm.position.add(offset)));
    return this;
  }

  _createEdges() {
    this.distance_constraints = pairReduce(
      this.pointmasses,
      (acc, pm1, pm2) => {
        acc.push(new DistanceConstraint(pm1, pm2));
        return acc;
      },
      [],
    );
  }

  _createJoints() {
    this.angle_constraints = pairReduce(
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
    throwIfNotType(force, Vector, "Shape: force");
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

  // centerOfMass() {
  //   this.vertices.reduce(
  //     (center, vertex) => center.add(vertex),
  //     new Vector(0, 0),
  //   );
  // }
}
