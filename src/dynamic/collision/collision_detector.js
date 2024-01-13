import { Collider } from '../../index.js';

export default class CollisionDetector {
  constructor(colliders=[]) {
    colliders.forEach((collider, i) => { 
      if (!(collider instanceof Collider)) 
        throw new Error(`CollisionDetector: object at index: ${i} is not a Collider`);
    });
    this.colliders = colliders;
    this.collisions = [];
  }

  static fromObjects(objects) {
    return new Detector(objects.map(obj => obj.createCollider()));
  }

  update(step=1) {
    this._sortColliders();
    this.check();
    this.resolve(step);
  }

  check() {
    this.collisions = [];

    outer: for (let i = 0; i < this.colliders.length; i++) {
      for (let j = i + 1; j < this.colliders.length; j++) {
        const collider1 = this.colliders[i];
        const collider2 = this.colliders[j];

        const collision = collider1.check(collider2);
        if (collision.isColliding()) {
          this.collisions.push(collision);
        } else {
          continue outer;
        }
      }
    }
    return this;
  }

  resolve(step=1) {
    this.collisions.forEach(collision => collision.resolve(step));
    return this;
  }

  // TODO: this sorting is not accurate
  _sortColliders() {
    this.colliders.sort((c1, c2) => {
      return c1.getBoundingBox()[0].x - c2.getBoundingBox()[0].x;
    });
  }
}
