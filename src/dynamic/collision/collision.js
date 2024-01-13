import { Vector } from '../../index.js';

export default class Collision {
  constructor (is_colliding, object1=null, object2=null, mtv1=null, mtv2=null) {
    this.object1 = object1;
    this.object2 = object2;
    this.mtv1 = mtv1;
    this.mtv2 = mtv2;
    this.is_colliding = is_colliding;
  }

  isColliding() {
    return this.is_colliding;
  }

  resolve(step=1) {
    if (step <= 0) throw new Error("Collider: step must be positive");
    if (!this.is_colliding) return;

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
      const new_vel1 = pm1.getVelocity().reflect(dir2);
      const new_mtv1 = pm2.isLocked()
        ? this.mtv1
        : Vector.mul(this.mtv1, pm2.mass / sum_mass);
      pm1.addPosCorrection(new_mtv1, step);
      pm1.setVelocity(new_vel1);
    }

    if (!pm2.isLocked()) {
      const new_vel2 = pm2.getVelocity().reflect(dir1);
      const new_mtv2 = pm1.isLocked()
        ? this.mtv2
        : Vector.mul(this.mtv2, pm1.mass / sum_mass);
      pm2.addPosCorrection(new_mtv2, step);
      pm2.setVelocity(new_vel2);
    }
  }
}
