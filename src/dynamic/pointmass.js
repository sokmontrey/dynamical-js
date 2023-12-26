import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";
import { throwIfNotNumber, throwIfNotType } from "../util/error.js";

export default class PointMass {
  constructor(pos = new Vector(250, 250), mass = 1) {
    throwIfNotType(pos, Vector, "PointMass: pos");
    Vector.checkNan(pos, "PointMass.constructor");
    throwIfNotNumber(mass, "PointMass: mass");

    this.old_pos = pos.copy();
    this.now_pos = pos.copy();
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
    throwIfNotType(force, Vector, "PointMass: applyForce: force");
    Vector.checkNan(force, "PointMass.applyForce");
    this.acc = this.acc.add(force.div(this.mass));
  }

  updatePosition(dt = 0.25, step = 1) {
    throwIfNotNumber(dt, "PointMass: updatePosition: dt");
    throwIfNotNumber(step, "PointMass: updatePosition: step");
    if (this.is_locked) {
      // throw new Error("PointMass: calling updatePosition on static pointmass");
      return;
    }
    if (!dt) {
      throw new Error("PointMass: updatePosition: dt is undefined or zero");
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
    throwIfNotType(pos, Vector, "PointMass: set position: pos");
    Vector.checkNan(pos, "PointMass.set position");
    this.now_pos = pos;
  }

  addPosCorrection(correction, step = 1) {
    throwIfNotType(
      correction,
      Vector,
      "PointMass: addPosCorrection: correction",
    );
    throwIfNotNumber(step, "PointMass: addPosCorrection: step");
    Vector.checkNan(correction, "PointMass.addPositionCorrection");
    this.pos_correction = this.pos_correction.add(correction.div(step));
  }

  setPosition(position) {
    throwIfNotType(position, Vector, "PointMass: setPosition: position");
    Vector.checkNan(position, "PointMass.setPosition");
    this.position = position;
    this.old_position = position;
    return this;
  }

  get old_position() {
    return this.old_pos;
  }
  set old_position(pos) {
    throwIfNotType(pos, Vector, "PointMass: set old_position: pos");
    Vector.checkNan(pos, "PointMass.set old_position");
    this.old_pos = pos;
  }

  get velocity() {
    return this.now_pos.sub(this.old_pos);
  }
  set velocity(vel) {
    throwIfNotType(vel, Vector, "PointMass: set velocity: vel");
    Vector.checkNan(vel, "PointMass.set velocity");
    this.old_pos = this.now_pos.sub(vel);
  }

  getMass() {
    return this.mass;
  }
  setMass(mass) {
    throwIfNotNumber(mass, "PointMass: setMass: mass");
    this.mass = mass;
    return this;
  }
}
