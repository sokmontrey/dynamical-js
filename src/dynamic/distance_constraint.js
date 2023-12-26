import { throwIfNotNumber, throwIfNotType } from "../util/error.js";
import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";
import Constraint from "./constraint.js";
import Pointmass from "./pointmass.js";

export default class DistanceConstraint extends Constraint {
  constructor(pointmass1, pointmass2, stiffness = 1) {
    throwIfNotType(pointmass1, Pointmass, "DistanceConstraint: pointmass1");
    throwIfNotType(pointmass2, Pointmass, "DistanceConstraint: pointmass2");
    throwIfNotNumber(stiffness, "DistanceConstraint: stiffness");

    super(stiffness);
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;

    this.distance = 0;
    this._calculateConstraintValue();

    this.graphic = new Graphic("black", "gray")
      .setStrokeWidth(2)
      .setStrokeColor("gray")
      .noFill()
      .stroke();
  }

  getDistance() {
    return this.distance;
  }

  _calculateConstraintValue() {
    this.distance = Vector.dist(
      this.pointmass1.position,
      this.pointmass2.position,
    );
    return this;
  }

  update(step = 1) {
    if (this.is_disabled) return;
    if (this.pointmass1.isLocked() && this.pointmass2.isLocked()) {
      return;
    }

    const pm1 = this.pointmass1;
    const pm2 = this.pointmass2;

    const diff_v = Vector.sub(pm2.position, pm1.position);
    const dist = Vector.mag(diff_v);
    const diff = dist - this.distance;

    if (diff === 0) return;
    if (this._checkBreakingThreshold(dist)) return;

    const correction = Vector.mul(
      diff_v,
      this.stiffness * diff / dist,
    );

    const sum_mass = pm1.mass + pm2.mass;
    if (!pm1.isLocked()) {
      const pm1_correction = pm2.isLocked()
        ? correction
        : Vector.mul(correction, pm2.mass / sum_mass);
      pm1.addPosCorrection(pm1_correction, step);
    }
    if (!pm2.isLocked()) {
      const pm2_correction = pm1.isLocked()
        ? correction
        : Vector.mul(correction, pm1.mass / sum_mass);
      pm2.addPosCorrection(Vector.neg(pm2_correction), step);
    }
  }
}
