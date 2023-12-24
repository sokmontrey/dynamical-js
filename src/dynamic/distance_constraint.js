import Vector from "../math/vector.js";
import Graphic from "../util/graphic.js";

export default class DistanceConstraint {
  constructor(pointmass1, pointmass2, stiffness = 1) {
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;
    this.stiffness = stiffness;
    this.distance = Vector.dist(pointmass1.position, pointmass2.position);

    this.graphic = new Graphic("black", "gray")
      .setStrokeWidth(2)
      .setStrokeColor("gray")
      .noFill()
      .stroke();
  }

  update(step = 1) {
    if (this.pointmass1.isLocked() && this.pointmass2.isLocked()) {
      return;
    }

    const pm1 = this.pointmass1;
    const pm2 = this.pointmass2;

    const diff_v = Vector.sub(pm2.position, pm1.position);
    const dist = Vector.mag(diff_v);
    const diff = dist - this.distance;

    if (diff === 0) return;

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
