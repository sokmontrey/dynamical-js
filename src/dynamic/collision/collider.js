import {
  Circle,
  DynArray,
  Line,
  PointMass,
  Shape,
  Vector,
} from "../../index.js";

export default class Collider {
  constructor(object1, object2, is_optimize_axes = true) {
    this.checker = null;
    this.is_optimize_axes = is_optimize_axes;
    this._makeChecker(object1, object2);
  }

  check(renderer) {
    const [is_collided, mtv, object1, object2] = this.checker.check();
    if (is_collided) {
      // renderer.drawPolygon(object2.getPointMasses().map((pm) => pm.position.add(mtv.div(2)))).setFillColor("red").fill();
      // renderer.drawPolygon(object1.getPointMasses().map((pm) => pm.position.add(mtv.div(-2)))).setFillColor("blue").fill();
      //project object2 pointmasses onto mtv.norm() and get smallest pointmass
      const pm1 = object2.getPointMasses().reduce((min, pm) => {
        const t = mtv.norm().dot(pm.position);
        return t < min[0] ? [t, pm] : min;
      }, [Infinity, null])[1];

      const pm2 = object1.getPointMasses().reduce((min, pm) => {
        const t = mtv.neg().norm().dot(pm.position);
        return t < min[0] ? [t, pm] : min;
      }, [Infinity, null])[1];

      pm1.position = pm1.position.add(mtv.mul(0.3));
      pm2.position = pm2.position.sub(mtv.mul(0.3));
    }
  }

  _makeChecker(object1, object2) {
    const checker_map = [
      [Circle, Circle, CircleCircleChecker],
      [Circle, Shape, CirclePolygonChecker],
      [Shape, Shape, PolygonPolygonChecker],
    ];

    const [type1, type2, checker] = checker_map.find(([type1, type2]) =>
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

  _makeAxes(polygon) {
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

  check() {
    return null;
  }
}
class CircleCircleChecker extends Checker {
  constructor(circle1, circle2) {
    super(circle1, circle2);
  }
}

class CirclePolygonChecker extends Checker {
  constructor(circle, polygon) {
    super(circle, polygon);
    this.axes = this._makeAxes(polygon);
  }

  check() {
    // for (let i = 0; i < this.axes.length; i++) {
    //   this.axes[i].updateLine();
    // }
    // const is_gap = this.axes.some((axis) => {
    //   const [min1, max1] = this.object2.getPointMasses().reduce(
    //     ([min, max], pm) => {
    //       const t = Line.t(axis.line, pm.position);
    //       return [Math.min(min, t), Math.max(max, t)];
    //     },
    //     [Infinity, -Infinity],
    //   );
    //
    //   const t = Line.t(axis.line, this.object1.getPosition());
    //   const min2 = t - this.object1.radius;
    //   const max2 = t + this.object1.radius;
    //
    //   return max1 < min2 || max2 < min1;
    // });
    // return is_gap;
  }
}

class PolygonPolygonChecker extends Checker {
  constructor(polygon1, polygon2) {
    super(polygon1, polygon2);
    this.axes = this._makeAxes(polygon1).concat(this._makeAxes(polygon2));
  }

  check() {
    let min_depth = Infinity;
    let mtv = new Vector(0, 0);
    const is_gap = this.axes.some((axis) => {
      axis.updateDir();

      const [min1, max1] = this.object1.getPointMasses().reduce(
        ([min, max], pm) => {
          const t = axis.dir.dot(pm.position);
          return [Math.min(min, t), Math.max(max, t)];
        },
        [Infinity, -Infinity],
      );
      const [min2, max2] = this.object2.getPointMasses().reduce(
        ([min, max], pm) => {
          const t = axis.dir.dot(pm.position);
          return [Math.min(min, t), Math.max(max, t)];
        },
        [Infinity, -Infinity],
      );

      if (max1 < min2 || max2 < min1) {
        return true;
      }

      const depth = Math.min(max1 - min2, max2 - min1);
      if (depth < min_depth) {
        min_depth = depth;
        mtv = axis.dir.mul(depth * (max1 < max2 ? 1 : -1));
      }
    });

    return [!is_gap, mtv, this.object1, this.object2];
  }
}
