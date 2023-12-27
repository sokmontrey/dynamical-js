import { DynError, PointMass, Shape, Circle } from "../../index.js";

export default class Container {
  constructor(pointmasses = []) {
    pointmasses.every((pm) => {
      DynError.throwIfNotType(pm, PointMass, "Container: points");
    });

    this.pointmasses = pointmasses;
    this.circles = [];
    this.friction = 0.08;
  }

  update(){
    this._updatePointMasses();
    this._updateCircle();
  }

  addPointMass(pointmass) {
    DynError.throwIfNotType(pointmass, PointMass, "Container: addPoint: point");
    this.pointmasses.push(pointmass);
    return this;
  }

  addPointMasses(pointmasses) {
    DynError.throwIfEmpty(pointmasses, "Container: addPoints: points");
    pointmasses.every((pm) => {
      DynError.throwIfNotType(pm, PointMass, "Container: addPoints: point");
    });
    this.pointmasses = this.pointmasses.concat(pointmasses);
    return this;
  }

  addShape(shape) {
    DynError.throwIfNotType(shape, Shape, "Container: addShape: shape");
    this.pointmasses = this.pointmasses.concat(shape.getPointMasses());
    return this;
  }

  addCircle(circle) {
    DynError.throwIfNotType(circle, Circle, "Container: addCircle: circle");
    this.circles.push(circle);
    return this;
  }
}
