import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class PointMass {
  constructor(x=250, y=250, mass=1) {
    this.old_pos = new Vector(x, y);
    this.pos = new Vector(x, y);
    this.acc = new Vector(0, 0);
    this.mass = mass;
    this.graphic = new Graphic("gray", "black");
  }

  applyForce(force) {
    Vector.checkNan(force, "PointMass.applyForce");
    this.acc = this.acc.add(force.div(this.mass));
  }

  updatePosition(dt = 0.025) {
    if (!dt) console.error("PointMass: updatePosition: dt is undefined or zero");

    const temp_pos = this.pos;
    this.pos = this.pos.add(this.pos.sub(this.old_pos));
    this.pos = this.pos.add(this.acc.mul(dt * dt));
    this.old_pos = temp_pos;
  }

  get position() {
    return this.pos;
  }
  set position(pos) {
    Vector.checkNan(pos, "PointMass.set position");
    this.pos = pos;
  }
  get velocity() {
    return this.pos.sub(this.old_pos);
  }
  set velocity(vel) {
    Vector.checkNan(vel, "PointMass.set velocity");
    this.old_pos = this.pos.sub(vel);
  }
}
