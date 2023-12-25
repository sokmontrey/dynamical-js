import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class DistanceConstraint {
  constructor(pointmass1, pointmass2, stiffness = 1) {
    //TODO: check if pointmass1 and pointmass2 are valid PointMass
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;
    this.stiffness = stiffness;
    this.distance = 0;

    this.is_disabled = false;
    this.breaking_threshold = 0;

    this._calculateDistance();

    this.graphic = new Graphic("black", "gray")
      .setStrokeWidth(2)
      .setStrokeColor("gray")
      .noFill()
      .stroke();
  }

  disable() {
    this.is_disabled = true;
    this.graphic.noStroke();
    return this;
  }

  setBreakingThreshold(threshold) {
    if (threshold < 0) {
      throw new Error("DistanceConstraint.setBreakingThreshold: threshold < 0");
    }
    this.breaking_threshold = threshold;
    return this;
  }
  noBreaking() {
    this.breaking_threshold = 0;
    return this;
  }

  getDistance() {
    return this.distance;
  }

  enable(is_cal_new_dist = false) {
    this.is_disabled = false;
    this.graphic.stroke();
    if (is_cal_new_dist) {
      this._calculateDistance();
    }
    return this;
  }

  _calculateDistance() {
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

    if (this.breaking_threshold > 0 && dist > this.breaking_threshold) {
      this.disable();
      return;
    }

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
