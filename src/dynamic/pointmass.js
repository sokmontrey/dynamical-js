import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class PointMass {
  constructor(x=250, y=250, mass=1) {
    this.old_pos = new Vector(x, y);
    this.now_pos = new Vector(x, y);
    this.pos_correction = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.mass = mass;
    this.graphic = new Graphic("gray", "black");
  }

  applyForce(force) {
    Vector.checkNan(force, "PointMass.applyForce");
    this.acc = this.acc.add(force.div(this.mass));
  }

  updatePosition(dt = 0.025, ) {
    if (!dt) console.error("PointMass: updatePosition: dt is undefined or zero");

    const temp_pos = this.now_pos.add(this.pos_correction);
    this.now_pos = temp_pos
      .add(this.now_pos.sub(this.old_pos))
      .add(this.acc.mul(dt * dt));
    this.old_pos = temp_pos;
    this.pos_correction = new Vector(0, 0);
  }

  get position() {
    return this.now_pos;
  }
  set position(pos) {
    Vector.checkNan(pos, "PointMass.set position");
    this.now_pos= pos;
  }

  addPosCorrection(correction) {
    Vector.checkNan(correction, "PointMass.addPositionCorrection");
    this.pos_correction = this.pos_correction.add(correction);
  }

  get old_position() {
    return this.old_pos;
  }
  set old_position(pos) {
    Vector.checkNan(pos, "PointMass.set old_position");
    this.old_pos = pos;
  } 

  get velocity() {
    return this.now_pos.sub(this.old_pos);
  }
  set velocity(vel) {
    Vector.checkNan(vel, "PointMass.set velocity");
    this.old_pos = this.now_pos.sub(vel);
  }
}
