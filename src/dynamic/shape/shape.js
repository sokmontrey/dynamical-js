import {
  AngleConstraint,
  DistanceConstraint,
  DynArray,
  DynError,
  PointMass,
  ShapeGraphic,
  Vector,
} from "../../index.js";

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
      .noBoundingBox()
      .noCenterOfMass("#ff5555");
    this.graphic.draw = (renderer) => {
      renderer.drawPolygon(this.pointmasses.map((pm) => pm.position));
      renderer.renderGraphic(this.graphic);
      if (this.graphic.is_distance_constraints) {
        for (let i = 0; i < this.distance_constraints.length; i++) {
          this.distance_constraints[i].graphic.draw(renderer);
        }
      }
      if (this.graphic.is_vertices) {
        for (let i = 0; i < this.pointmasses.length; i++) {
          this.pointmasses[i].graphic.draw(renderer);
        }
      }
      if (this.graphic.is_joints) {
        for (let i = 0; i < this.angle_constraints.length; i++) {
          this.angle_constraints[i].graphic.draw(renderer);
        }
      }
      if (this.graphic.is_center_of_mass) {
        renderer.drawCircle(this.getCenterOfMass(), 5)
          .setFillColor(this.graphic.cener_of_mass_color)
          .fill();
      }
      if (this.graphic.is_bounding_box) {
        const [l, u] = this.getBoundingBox();
        renderer.drawPolygon([l, new Vector(l.x, u.y), u, new Vector(u.x, l.y)])
          .setStrokeColor(this.graphic.bounding_box_color)
          .stroke();
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
    for (let i = 0; i < this.pointmasses.length; i++) {
      this.pointmasses[i].setPosition(
        position.add(this.pointmasses[i].position.sub(center)),
      );
    }
    return this;
  }

  getPosition() {
    return this.getCenterOfMass();
  }

  setVelocity(velocity) {
    for (let i = 0; i < this.pointmasses.length; i++) {
      this.pointmasses[i].setVelocity(velocity);
    }
    return this;
  }

  applyForce(force) {
    for (let i = 0; i < this.pointmasses.length; i++) {
      this.pointmasses[i].applyForce(force);
    }
    return this;
  }

  // reserve velocity
  rotateBy(angle, center = this.getCenterOfMass()) {
    for (let i = 0; i < this.pointmasses.length; i++) {
      const pm = this.pointmasses[i];
      const center_to_pm = pm.position.sub(center);
      pm.addPosCorrection(
        center_to_pm.rot(angle).sub(center_to_pm),
      );
    }
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
    for (let i = 0; i < this.pointmasses.length; i++) {
      this.pointmasses[i].applyForce(force);
    }
    return this;
  }

  updatePointMasses(dt = 0.25, step = 1) {
    for (let i = 0; i < this.pointmasses.length; i++) {
      this.pointmasses[i].update(dt, step);
    }
    return this;
  }

  updateDistanceConstraints(step = 1) {
    for (let i = 0; i < this.distance_constraints.length; i++) {
      this.distance_constraints[i].update(step);
    }
    return this;
  }

  updateAngleConstraints(step = 1) {
    for (let i = 0; i < this.angle_constraints.length; i++) {
      this.angle_constraints[i].update(step);
    }
    return this;
  }

  update(dt = 0.25, step = 1) {
    this.updateDistanceConstraints(step);
    this.updateAngleConstraints(step);
    this.updatePointMasses(dt, step);
    return this;
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

  getBoundingBox() {
    return this.pointmasses.reduce(
      (acc, pm) => {
        acc[0] = acc[0].min(pm.position);
        acc[1] = acc[1].max(pm.position);
        return acc;
      },
      [new Vector(Infinity, Infinity), new Vector(-Infinity, -Infinity)],
    );
  }
}
