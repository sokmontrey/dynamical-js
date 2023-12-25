import Vector from "../math/vector.js";

export default class AngleConstraint {
  constructor(dist_const1, dist_const2, stiffness = 1) {
    this.pointmass1 = undefined;
    this.pointmass2 = undefined;
    this.pointmass3 = undefined;

    this.stiffness = stiffness;
    this.angle = 0;

    this._organizePointmasses(dist_const1, dist_const2);
    if (this.pointmass2 === undefined) {
      throw new Error(
        "AngleConstraint: constraint must have 2 shared pointmasses",
      );
    }

    this._calculateAngle();
  }

  _calculateAngle() {
    this.angle = Vector.angleBetween(
      this.pointmass1.position.sub(this.pointmass2.position),
      this.pointmass3.position.sub(this.pointmass2.position),
    );
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
}
