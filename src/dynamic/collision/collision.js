export default class Collision {
  constructor(shape1, shape2, normal, depth, pointmass1, pointmass2) {
    this.shape1 = shape1;
    this.shape2 = shape2;
    this.normal = normal;
    this.depth = depth;
    this.pointmass1 = pointmass1;
    this.pointmass2 = pointmass2;
  }
}
