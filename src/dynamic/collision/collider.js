import { Vector, DynArray, Shape, Circle, Collision } from '../../index.js';

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

  project(object) {
    if (object instanceof Circle) {
      return this._projectCircle(object);
    }
    if (object instanceof Shape) {
      return this._projectPolygon(object);
    }
    return [null, null];
  }

  _projectPolygon(polygon) {
    return polygon.getPointMasses()
      .reduce(([min, max], pm) => {
        const t = this.dir.dot(pm.position);
        return [Math.min(min, t), Math.max(max, t)];
      }, [Infinity, -Infinity]);
  }

  _projectCircle(circle) {
    const center_on_axis = circle.getPosition().dot(this.dir);
    return [
      center_on_axis - circle.getRadius(),
      center_on_axis + circle.getRadius(),
    ];
  }
}

class Collider {
  constructor(object, is_optimize_axes = true) {
    this.object = object;
    this.axes = [];
    this.is_optimize_axes = is_optimize_axes;
  }

  check(other_collider) {
    if (other_collider === null)
      throw new Error("Collider: check: the other object does not have a Collider. Please use object.initCollider()");

    let min_depth = Infinity;
    let min_axis = null;
    let direction = 1;

    const axes = this.getAxes(other_collider)
      .concat(other_collider.getAxes(this));

    const is_gap = axes.some((axis) => {
      axis.updateDir();

      const [min1, max1] = axis.project(this.object);
      const [min2, max2] = axis.project(other_collider.object);

      const depth = Math.min(max1 - min2, max2 - min1);
      if (depth <= 0) return true;
      if (depth < min_depth) {
        min_depth = depth;
        min_axis = axis;
        direction = max1 < max2 ? 1 : -1;
      }
      return false;
    });

    if (is_gap) return new Collision(false, null, null, null, null);
    const mtv = min_axis.dir.mul(min_depth * direction * 0.5);
    return new Collision(true, this.object, other_collider.object, mtv, mtv.neg());
  }

  getAxes() {
    return this.axes;
  }
}

export class PolygonCollider extends Collider {
  constructor(object) {
    super(object);

    this.axes = DynArray.pairReduce(
      this.object.getPointMasses(),
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

  getAxes() {
    return this.axes;
  }
}

export class CircleCollider extends Collider {
  constructor(object) {
    super(object);

    this.axes = [];
  }

  getAxes(other_collider) {
    const center_pm = this.object.getCenterPointMass();
    return other_collider.object.getPointMasses().map((pm) => {
      return new Axis(center_pm, pm);
    });
  }
}


