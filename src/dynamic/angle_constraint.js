import Vector from "../math/vector.js";
import Constraint from "./constraint.js";
import Graphic from "../util/graphic.js";
import { throwIfNotNumber, throwIfUndefined } from "../util/error.js";

export default class AngleConstraint extends Constraint {
  constructor(dist_const1, dist_const2, stiffness = 1) {
    throwIfUndefined(dist_const1, "AngleConstraint: dist_const1");
    throwIfUndefined(dist_const2, "AngleConstraint: dist_const2");
    throwIfNotNumber(stiffness, "AngleConstraint: stiffness");

    super(stiffness);
    this.pointmass1 = undefined;
    this.pointmass2 = undefined;
    this.pointmass3 = undefined;

    this._organizePointmasses(dist_const1, dist_const2);
    if (this.pointmass2 === undefined) {
      throw new Error(
        "AngleConstraint: constraint must have 2 shared pointmasses",
      );
    }

    this.angle = 0;
    this._calculateConstraintValue();

    this.graphic = new Graphic("#ff5555", "gray")
      .fill()
      .setSize(15)
      .noStroke();
  }

  _organizePointmasses(dist_const1, dist_const2) {
    const pointmass_map = [
      dist_const1.pointmass1,
      dist_const1.pointmass2,
      dist_const2.pointmass1,
      dist_const2.pointmass2,
    ].reduce((acc, pm) => {
      return acc.set(pm, acc.has(pm) ? 2 : 1);
    }, new Map());

    [...pointmass_map.entries()].forEach(([pm, count]) => {
      if (count === 2) {
        this.pointmass2 = pm;
        return;
      }

      if (this.pointmass1 === undefined) this.pointmass1 = pm;
      else this.pointmass3 = pm;
    });
  }

  _calculateConstraintValue() {
    this.angle = Vector.angleBetween(
      this.pointmass1.position.sub(this.pointmass2.position),
      this.pointmass3.position.sub(this.pointmass2.position),
    );
  }

  update(step = 1) {
    if (this.is_disabled) return;
    if (
      this.pointmass1.isLocked() && this.pointmass2.isLocked() &&
      this.pointmass3.isLocked()
    ) return;

    const pm1 = this.pointmass1;
    const pm2 = this.pointmass2;
    const pm3 = this.pointmass3;

    const p21 = pm1.position.sub(pm2.position);
    const p23 = pm3.position.sub(pm2.position);

    const angle = Vector.angleBetween(p21, p23);
    const diff = angle - this.angle;

    if (diff === 0) return;
    if (this._checkBreakingThreshold(Math.abs(angle))) return;

    const correction_angle = this.stiffness * diff;

    const sum_mass = pm1.mass + pm3.mass;
    if (!pm1.isLocked()) {
      const propotion = pm3.isLocked() ? 1 : pm3.mass / sum_mass;
      const pm1_correction = p21.rot(correction_angle * propotion).sub(p21);
      pm1.addPosCorrection(pm1_correction, step);
    }
    if (!pm3.isLocked()) {
      const propotion = pm1.isLocked() ? 1 : pm1.mass / sum_mass;
      const pm3_correction = p23.rot(-correction_angle * propotion).sub(p23);
      pm3.addPosCorrection(pm3_correction, step);
    }
  }
}
