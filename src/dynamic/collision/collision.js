import { Collider } from "../../index.js";

export default class Collision {
  constructor(object_list = [], static_object_list = []) {
    this.object_list = object_list;
    this.static_object_list = static_object_list;

    this.colliders = [];
    this._makeColliders();
  }

  update(step = 1) {
    for (let i = 0; i < this.colliders.length; i++) {
      this.colliders[i].check();
      this.colliders[i].resolve(step);
    }
  }

  add(object) {
    this.object_list.push(object);
    this._addColliders();
  }

  addStatic(object) {
    this.static_object_list.push(object);
    this._addStaticColliders();
  }

  _addColliders() {
    const last = this.object_list.length - 1;
    const last_object = this.object_list[last];
    for (let i = 0; i < last; i++) {
      const collider = new Collider(last_object, this.object_list[i]);
      this.colliders.push(collider);
    }

    for (let i = 0; i < this.static_object_list.length; i++) {
      const collider = new Collider(last_object, this.static_object_list[i]);
      this.colliders.push(collider);
    }
  }

  _addStaticColliders() {
    const last = this.static_object_list.length - 1;
    const last_object = this.static_object_list[last];

    for (let i = 0; i < this.object_list.length; i++) {
      const collider = new Collider(last_object, this.object_list[i]);
      this.colliders.push(collider);
    }
  }

  _makeColliders() {
    for (let i = 0; i < this.object_list.length; i++) {
      for (let j = i + 1; j < this.object_list.length; j++) {
        const collider = new Collider(this.object_list[i], this.object_list[j]);
        this.colliders.push(collider);
      }

      for (let j = 0; j < this.static_object_list.length; j++) {
        const collider = new Collider(
          this.object_list[i],
          this.static_object_list[j],
        );
        this.colliders.push(collider);
      }
    }
  }
}
