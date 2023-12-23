import Vector from './vector.js';

export default class Line {
  constructor (p1, p2, is_unit=true) {
    this.p1 = p1;
    this.p2 = p2;
    this.origin = p1;

    if (is_unit) {
      this.dir = p2.sub(p1).norm();
    } else {
      this.dir = p2.sub(p1);
    }
  }

  static norm(line) {
    return new Vector(-line.dir.y, line.dir.x);
  }
  norm() {
    return Line.norm(this);
  }

  static fromDir(origin, dir) {
    return new Line(origin, origin.add(dir), false);
  }

  static fromPoints(p1, p2) {
    return new Line(p1, p2);
  }

  static pointOnLine(line, t) {
    return line.p1.add(line.dir.mul(t));
  }
  pointOnLine(t) {
    return Line.pointOnLine(this, t);
  }

  static pointWithX(line, x) {
    if (line.dir.x === 0) {
      console.error('Cannot find point with x on vertical line!');
    }
    return line.pointOnLine((x - line.p1.x) / line.dir.x);
  }
  pointWithX(x) {
    return Line.pointWithX(this, x);
  }

  static intersect(line1, line2) {
    const denom = line1.dir.x * line2.dir.y - line1.dir.y * line2.dir.x;
    if (denom === 0) {
      console.error('Lines are parallel!');
    }
    const t = (line2.dir.x * (line1.p1.y - line2.p1.y) - line2.dir.y * (line1.p1.x - line2.p1.x)) / denom;
    return line1.pointOnLine(t);
  }

  static closestToPoint(line, point) {
    const line2 = Line.fromDir(point, line.dir.perp());
    return Line.intersect(line, line2);
  }
  closestToPoint(point) {
    return Line.closestToPoint(this, point);
  }
}
