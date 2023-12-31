import { Circle, DynArray, Shape, Vector } from "../../index.js";

export default class Collider {
  constructor(object1, object2, is_optimize_axes = true) {
    this.object1 = object1;
    this.object2 = object2;

    this.checker = null;
    this.is_optimize_axes = is_optimize_axes;
    this._makeChecker(object1, object2);

    this.is_collided = false;
    this.mtv1 = null;
    this.mtv2 = null;
  }

  update(step = 1) {
    this.check();
    this.resolve(step);
  }

  check() {
    [this.is_collided, this.mtv1, this.mtv2] = this.checker.check();
  }

  isBoundCollided() {
    const [l1, u1] = this.object1.getBoundingBox();
    const [l2, u2] = this.object2.getBoundingBox();

    return (
      l1.x <= u2.x && l2.x <= u1.x && l1.y <= u2.y && l2.y <= u1.y
    );
  }

  resolve(step = 1) {
    if (step <= 0) throw new Error("Collider: step must be positive");
    if (!this.is_collided) return;

    const dir1 = this.mtv1.norm();
    const dir2 = this.mtv2.norm();

    const pm1 = this.object2.getPointMasses().reduce((min, pm) => {
      const t = dir1.dot(pm.position);
      return t < min[0] ? [t, pm] : min;
    }, [Infinity, null])[1];

    const pm2 = this.object1.getPointMasses().reduce((min, pm) => {
      const t = dir2.dot(pm.position);
      return t < min[0] ? [t, pm] : min;
    }, [Infinity, null])[1];

    const sum_mass = pm1.mass + pm2.mass;
    if (!pm1.isLocked()) {
      const new_mtv1 = pm2.isLocked()
        ? this.mtv1
        : Vector.mul(this.mtv1, 1.1 * pm2.mass / sum_mass);
      pm1.addPosCorrection(new_mtv1, step);
    }
    if (!pm2.isLocked()) {
      const new_mtv2 = pm1.isLocked()
        ? this.mtv2
        : Vector.mul(this.mtv2, 1.1 * pm1.mass / sum_mass);
      pm2.addPosCorrection(new_mtv2, step);
    }
  }

  isCollided() {
    return this.is_collided;
  }

  getMTV1() {
    return this.mtv1;
  }

  getMTV2() {
    return this.mtv2;
  }

  _makeChecker(object1, object2) {
    const checker_map = [
      [Circle, Circle, CircleCircleChecker],
      [Circle, Shape, CirclePolygonChecker],
      [Shape, Shape, PolygonPolygonChecker],
    ];

    const [type1, _, checker] = checker_map.find(([type1, type2]) =>
      (object1 instanceof type1 && object2 instanceof type2) ||
      (object1 instanceof type2 && object2 instanceof type1)
    );

    this.checker = new checker(
      object1 instanceof type1 ? object1 : object2,
      object1 instanceof type1 ? object2 : object1,
      this.is_optimize_axes,
    );
  }
}

class Axis {
  constructor(pointmass1, pointmass2) {
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;

    this.dir = Vector.sub(pointmass2.position, pointmass1.position).norm();
  }

  dir() {
    return this.dir;
  }

  updateDir() {
    this.dir = Vector.sub(this.pointmass2.position, this.pointmass1.position)
      .norm();
    if (this.dir.x < 0) this.dir = this.dir.neg();
  }

  slope() {
    return this.dir.y / this.dir.x;
  }
}

class Checker {
  constructor(object1, object2, is_optimize_axes = true) {
    this.object1 = object1;
    this.object2 = object2;

    this.is_optimize_axes = is_optimize_axes;
    this.axes = [];
  }

  _makePolygonAxes(polygon) {
    return DynArray.pairReduce(
      polygon.getPointMasses(),
      (acc, pm1, pm2) => {
        const new_axis = new Axis(pm1, pm2);
        if (
          this.is_optimize_axes &&
          acc.some((axis) => axis.slope() === new_axis.slope())
        ) {
          return acc;
        }
        return acc.concat(new_axis);
      },
      [],
    );
  }

  _projectPointMasses(axis, pointmasses) {
    return pointmasses
      .reduce(([min, max], pm) => {
        const t = axis.dir.dot(pm.position);
        return [Math.min(min, t), Math.max(max, t)];
      }, [Infinity, -Infinity]);
  }

  _projectCircle(axis, circle) {
    const t = axis.dir.dot(circle.getPosition());
    return [t - circle.radius, t + circle.radius];
  }

  check() {
    return null;
  }
}
class CircleCircleChecker extends Checker {
  constructor(circle1, circle2) {
    super(circle1, circle2);
    this.axes = [
      new Axis(circle1.getCenterPointMass(), circle2.getCenterPointMass()),
    ];
  }

  check() {
    let min_depth = Infinity;
    let min_axis = null;
    let direction = 1;
    const is_gap = this.axes.some((axis) => {
      axis.updateDir();

      const [min1, max1] = this._projectCircle(axis, this.object1);
      const [min2, max2] = this._projectCircle(axis, this.object2);

      const depth = Math.min(max1 - min2, max2 - min1);
      if (depth <= 0) return true;
      if (depth < min_depth) {
        min_depth = depth;
        min_axis = axis;
        direction = max1 < max2 ? 1 : -1;
      }
      return false;
    });

    if (is_gap) return [false, null, null, null];
    const mtv = min_axis.dir.mul(min_depth * 0.5 * direction);
    return [true, mtv, mtv.neg()];
  }
}

class CirclePolygonChecker extends Checker {
  constructor(circle, polygon) {
    super(circle, polygon);
    this.axes = this._makePolygonAxes(polygon).concat(
      polygon.getPointMasses().map((pm) =>
        new Axis(circle.getCenterPointMass(), pm)
      ),
    );
  }

  check() {
    let min_depth = Infinity;
    let min_axis = null;
    let direction = 1;
    const is_gap = this.axes.some((axis) => {
      axis.updateDir();

      const [min1, max1] = this._projectCircle(axis, this.object1);
      const [min2, max2] = this._projectPointMasses(
        axis,
        this.object2.getPointMasses(),
      );

      const depth = Math.min(max1 - min2, max2 - min1);
      if (depth <= 0) return true;
      if (depth < min_depth) {
        min_depth = depth;
        min_axis = axis;
        if (max1 < max2) {
          direction = 1;
        } else {
          direction = -1;
        }
      }
      return false;
    });

    if (is_gap) return [false, null, null, null];
    const mtv = min_axis.dir.mul(min_depth * direction);
    return [true, mtv.neg().mul(0.4), mtv];
  }
}

class PolygonPolygonChecker extends Checker {
  constructor(polygon1, polygon2) {
    super(polygon1, polygon2);
    this.axes = this._makePolygonAxes(polygon1).concat(
      this._makePolygonAxes(polygon2),
    );
  }

  check() {
    let min_depth = Infinity;
    let min_axis = null;
    let direction = 1;
    const is_gap = this.axes.some((axis) => {
      axis.updateDir();

      const [min1, max1] = this._projectPointMasses(
        axis,
        this.object1.getPointMasses(),
      );
      const [min2, max2] = this._projectPointMasses(
        axis,
        this.object2.getPointMasses(),
      );

      const depth = Math.min(max1 - min2, max2 - min1);
      if (depth <= 0) return true;
      if (depth < min_depth) {
        min_depth = depth;
        min_axis = axis;
        direction = max1 < max2 ? 1 : -1;
      }
      return false;
    });

    if (is_gap) return [false, null, null, null];
    const mtv = min_axis.dir.mul(min_depth * direction);
    return [true, mtv, mtv.neg()];
  }
}
