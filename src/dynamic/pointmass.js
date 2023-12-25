import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class PointMass {
  constructor(x = 250, y = 250, mass = 1) {
    this.old_pos = new Vector(x, y);
    this.now_pos = new Vector(x, y);
    this.pos_correction = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.mass = mass;
    this.is_locked = false;

    this.graphic = new Graphic("gray", "black");
  }

  lock() {
    this.is_locked = true;
    return this;
  }
  isLocked() {
    return this.is_locked;
  }

  applyForce(force) {
    Vector.checkNan(force, "PointMass.applyForce");
    this.acc = this.acc.add(force.div(this.mass));
  }

  updatePosition(dt = 0.25, step = 1) {
    if (this.is_locked) {
      // console.error("PointMass: calling updatePosition on static pointmass");
      return;
    }
    if (!dt) {
      console.error("PointMass: updatePosition: dt is undefined or zero");
      return;
    }

    dt /= step;
    const temp = this.now_pos.add(this.pos_correction);
    this.now_pos = temp
      .add(temp.sub(this.old_pos))
      .add(this.acc.mul(dt * dt));

    this.old_pos = temp;
    this.pos_correction = new Vector(0, 0);
    this.acc = new Vector(0, 0);
  }

  get position() {
    return this.now_pos;
  }
  set position(pos) {
    Vector.checkNan(pos, "PointMass.set position");
    this.now_pos = pos;
  }

  addPosCorrection(correction, step=1) {
    Vector.checkNan(correction, "PointMass.addPositionCorrection");
    this.pos_correction = this.pos_correction.add(correction.div(step));
  }

  setPosition(position){
    Vector.checkNan(position, "PointMass.setPosition");
    this.position = position;
    this.old_position = position;
    return this;
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

  getMass() {
    return this.mass;
  }
  setMass(mass){
    this.mass = mass;
    return this;
  }
}
