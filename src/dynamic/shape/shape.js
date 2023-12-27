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
  constructor(
    pointmasses = [],
    is_create_edges = true,
    is_create_supports = true,
    is_create_joints = is_create_edges,
  ) {
    pointmasses.every((pointmass) => {
      DynError.throwIfNotType(pointmass, PointMass, "Shape: pointmasses");
    });
    DynError.throwIfEmpty(pointmasses, "Shape: vertices");

    this.pointmasses = pointmasses;
    this.edges = [];
    this.supports = [];
    this.joints = [];

    if (is_create_edges) this._createEdges();
    if (is_create_supports) this._createSupports();
    if (is_create_joints && is_create_edges) this._createJoints();

    this.graphic = new ShapeGraphic("#faf887", "#a0f080")
      .noWireframe()
      .noDistanceConstraints()
      .noVertices()
      .noJoints()
      .noBoundingBox()
      .noCenterOfMass("#ff5555");
  }

  draw(renderer) {
    renderer.drawPolygon(this.pointmasses.map((pm) => pm.position));
    renderer.renderGraphic(this.graphic);
    if (this.graphic.is_distance_constraints) {
      for (let i = 0; i < this.edges.length; i++) {
        this.edges[i].graphic.draw(renderer);
      }
      for (let i = 0; i < this.supports.length; i++) {
        this.supports[i].graphic.draw(renderer);
      }
    }
    if (this.graphic.is_vertices) {
      for (let i = 0; i < this.pointmasses.length; i++) {
        this.pointmasses[i].graphic.draw(renderer);
      }
    }
    if (this.graphic.is_joints) {
      for (let i = 0; i < this.joints.length; i++) {
        this.joints[i].graphic.draw(renderer);
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

  connect(pointmass_index1, pointmass_index2) {
    if (pointmass_index1 === pointmass_index2) {
      throw new Error("Shape: cannot connect pointmass to itself");
    }
    if (pointmass_index1 < 0 || pointmass_index1 >= this.pointmasses.length) {
      throw new Error("Shape: pointmass_index1 out of range");
    }
    if (pointmass_index2 < 0 || pointmass_index2 >= this.pointmasses.length) {
      throw new Error("Shape: pointmass_index2 out of range");
    }
    this.supports.push(
      new DistanceConstraint(
        this.pointmasses[pointmass_index1],
        this.pointmasses[pointmass_index2],
      ),
    );
    return this;
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
    this.edges = DynArray.pairReduce(
      this.pointmasses,
      (acc, pm1, pm2) => {
        acc.push(new DistanceConstraint(pm1, pm2));
        return acc;
      },
      [],
    );
  }

  _createSupports() {
    const num_vertices = this.pointmasses.length;
    let SUPPORT_LAYER = 0;
    if (num_vertices < 5) {
      SUPPORT_LAYER = 0;
    } else if (num_vertices >= 5 && num_vertices <= 7) {
      SUPPORT_LAYER = 1;
    } else {
      SUPPORT_LAYER = Math.floor(this.pointmasses.length / 3);
    }

    for (let SKIP = 1; SKIP <= SUPPORT_LAYER; SKIP++) {
      DynArray.pairIter(
        this.pointmasses,
        (pm1, pm2) => {
          this.supports.push(new DistanceConstraint(pm1, pm2));
        },
        SKIP,
      );
    }
  }

  _createJoints() {
    this.joints = DynArray.pairReduce(
      this.edges,
      (acc, dc1, dc2, i) => {
        acc.push(new AngleConstraint(dc1, dc2));
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

  updateEdges(step = 1) {
    for (let i = 0; i < this.edges.length; i++) {
      this.edges[i].update(step);
    }
    return this;
  }

  updateSupports(step = 1) {
    for (let i = 0; i < this.supports.length; i++) {
      this.supports[i].update(step);
    }
    return this;
  }

  updateAngleConstraints(step = 1) {
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].update(step);
    }
    return this;
  }

  update(dt = 0.25, step = 1) {
    this.updateEdges(step);
    this.updateSupports(step);
    this.updateAngleConstraints(step);
    this.updatePointMasses(dt, step);
    return this;
  }

  getPointMasses() {
    return this.pointmasses;
  }
  getEdges() {
    return this.edges;
  }
  getSupports() {
    return this.supports;
  }
  getJoints() {
    return this.joints;
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
