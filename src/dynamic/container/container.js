import { DynError, PointMass, Shape } from "../../index.js";

export default class Container {
  constructor(pointmasses = []) {
    pointmasses.every((pm) => {
      DynError.throwIfNotType(pm, PointMass, "Container: points");
    });

    this.pointmasses = pointmasses;
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
}
