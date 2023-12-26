import { DynError, Graphic, Vector } from "../index.js";

export default class PointMass {
  constructor(pos = new Vector(250, 250), mass = 1) {
    DynError.throwIfNotType(pos, Vector, "PointMass: pos");
    Vector.checkNan(pos, "PointMass.constructor");
    DynError.throwIfNotNumber(mass, "PointMass: mass");

    this.old_pos = pos.copy();
    this.now_pos = pos.copy();
    this.pos_correction = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.mass = mass;
    this.is_locked = false;

    this.graphic = new Graphic("gray", "black");
    this.graphic.draw = (renderer) => {
      if (!this.graphic.isVisible()) return;
      renderer.drawCircle(this.now_pos, 4);
      renderer.renderGraphic(this.graphic);
    };
  }

  lock() {
    this.is_locked = true;
    return this;
  }
  isLocked() {
    return this.is_locked;
  }

  applyForce(force) {
    DynError.throwIfNotType(force, Vector, "PointMass: applyForce: force");
    Vector.checkNan(force, "PointMass.applyForce");
    this.acc = this.acc.add(force.div(this.mass));
  }

  update(dt = 0.25, step = 1) {
    this.updatePosition(dt, step);
  }

  updatePosition(dt = 0.25, step = 1) {
    if (this.is_locked) return;
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
    DynError.throwIfNotType(pos, Vector, "PointMass: set position: pos");
    Vector.checkNan(pos, "PointMass.set position");
    this.now_pos = pos;
  }

  addPosCorrection(correction, step = 1) {
    DynError.throwIfNotType(
      correction,
      Vector,
      "PointMass: addPosCorrection: correction",
    );
    DynError.throwIfNotNumber(step, "PointMass: addPosCorrection: step");
    Vector.checkNan(correction, "PointMass.addPositionCorrection");
    this.pos_correction = this.pos_correction.add(correction.div(step));
  }

  setPosition(position) {
    DynError.throwIfNotType(
      position,
      Vector,
      "PointMass: setPosition: position",
    );
    Vector.checkNan(position, "PointMass.setPosition");
    this.position = position;
    this.old_position = position;
    return this;
  }

  get old_position() {
    return this.old_pos;
  }
  set old_position(pos) {
    DynError.throwIfNotType(pos, Vector, "PointMass: set old_position: pos");
    Vector.checkNan(pos, "PointMass.set old_position");
    this.old_pos = pos;
  }

  getVelocity() {
    return this.now_pos.sub(this.old_pos);
  }
  setVelocity(vel) {
    DynError.throwIfNotType(vel, Vector, "PointMass: set velocity: vel");
    Vector.checkNan(vel, "PointMass.set velocity");
    this.old_pos = this.now_pos.sub(vel);
  }

  getMass() {
    return this.mass;
  }
  setMass(mass) {
    DynError.throwIfNotNumber(mass, "PointMass: setMass: mass");
    this.mass = mass;
    return this;
  }
}
