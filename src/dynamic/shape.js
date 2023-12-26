import { throwIfEmpty } from "../util/error.js";
import Vector from "../math/vector.js";
import DistanceConstraint from "./distance_constraint.js";
import AngleConstraint from "./angle_constraint.js";
import PointMass from "./pointmass.js";
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
  }

  fromVertices(vertices = [], options = {}) {
    throwIfEmpty(vertices, "Shape: vectors");
    return new Shape(
      vertices.map((vertex) => new PointMass(vertex)),
      ...options,
    );
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

  // centerOfMass() {
  //   this.vertices.reduce(
  //     (center, vertex) => center.add(vertex),
  //     new Vector(0, 0),
  //   );
  // }
}
