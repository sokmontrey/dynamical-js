import {
  Circle,
  DynArray,
  Line,
  PointMass,
  Shape,
  Vector,
} from "../../index.js";

export default class Collider {
  constructor(object1, object2) {
    this.object1 = object1;
    this.object2 = object2;

    this.checker = null;
    this._makeChecker();
  }

  check(renderer) {
    this.checker.check(renderer);
  }

  _makeChecker() {
    const checker_map = [
      [Circle, Circle, CircleCircleChecker],
      [Circle, Shape, CirclePolygonChecker],
      [Shape, Shape, PolygonPolygonChecker],
    ];

    for (let [type1, type2, checker] of checker_map) {
      if (
        this.object1 instanceof type1 &&
        this.object2 instanceof type2
      ) {
        this.checker = new checker(this.object1, this.object2);
        return;
      } else if (
        this.object1 instanceof type2 &&
        this.object2 instanceof type1
      ) {
        this.checker = new checker(this.object2, this.object1);
        return;
      }
    }
  }
}

class Axis {
  constructor(pointmass1, pointmass2) {
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;

    this.line = null;
    this.updateLine();
  }

  line() {
    return this.line;
  }

  updateLine() {
    this.line = new Line(
      this.pointmass1.position,
      this.pointmass2.position,
    );
    this.line.dir = Vector.perp(this.line.dir);
  }

  slope() {
    return this.line.slope();
  }
}

class Checker {
  constructor(object1, object2) {
    this.object1 = object1;
    this.object2 = object2;

    this.axes = [];
  }

  _makeAxes(polygon) {
    return DynArray.pairReduce(
      polygon.getPointMasses(),
      (acc, pm1, pm2) => {
        const new_axis = new Axis(pm1, pm2);
        if (acc.some((axis) => axis.slope() === new_axis.slope())) {
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

  check(renderer) {
    let is_gap = false;

    for (let i = 0; i < this.axes.length; i++) {
      const axis = this.axes[i];
      axis.updateLine();

      const [min1, max1] = this.object1.getPointMasses().reduce(
        ([min, max], pm) => {
          const t = Line.t(axis.line, pm.position);
          return [Math.min(min, t), Math.max(max, t)];
        },
        [Infinity, -Infinity],
      );

      const [min2, max2] = this.object2.getPointMasses().reduce(
        ([min, max], pm) => {
          const t = Line.t(axis.line, pm.position);
          return [Math.min(min, t), Math.max(max, t)];
        },
        [Infinity, -Infinity],
      );

      if (max1 < min2 || max2 < min1) {
        is_gap = true;
        break;
      } 
    }

    return !is_gap;
  }
}
