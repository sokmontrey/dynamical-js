import Vector from "./vector.js";
import {
  throwIfNotNumber,
  throwIfNotType,
  throwIfUndefined,
} from "../util/error.js";
import Graphic from "../util/graphic.js";
import Renderer from "../util/renderer.js";

export default class Line {
  constructor(p1, p2, is_unit = true) {
    throwIfNotType(p1, Vector, "Line: p1");
    throwIfNotType(p2, Vector, "Line: p2");
    throwIfUndefined(is_unit, "Line: is_unit");

    this.p1 = p1;
    this.p2 = p2;
    this.origin = p1;

    if (is_unit) {
      this.dir = p2.sub(p1).norm();
    } else {
      this.dir = p2.sub(p1);
    }

    this.graphic = new Graphic("gray", "#11aaff")
      .setStrokeWidth(2)
      .noFill()
      .stroke();
    this.graphic.draw = (renderer) => {
      if (!this.graphic.isVisible()) return;
      try {
        renderer.drawLine(this.pointWithX(0), this.pointWithX(renderer.width));
      } catch (e) {
        renderer.drawLine(
          new Vector(this.p1.x, 0),
          new Vector(this.p1.x, renderer.height),
        );
      }
      renderer.renderGraphic(this.graphic);
    };
  }

  static norm(line) {
    throwIfNotType(line, Line, "Line: norm: line");
    return new Vector(-line.dir.y, line.dir.x);
  }
  norm() {
    return Line.norm(this);
  }

  static fromDir(origin, dir) {
    throwIfNotType(origin, Vector, "Line: fromDir: origin");
    throwIfNotType(dir, Vector, "Line: fromDir: dir");

    return new Line(origin, origin.add(dir), false);
  }

  static fromPoints(p1, p2) {
    throwIfNotType(p1, Vector, "Line: fromPoints: p1");
    throwIfNotType(p2, Vector, "Line: fromPoints: p2");

    return new Line(p1, p2);
  }

  static pointOnLine(line, t) {
    throwIfNotType(line, Line, "Line: pointOnLine: line");
    throwIfNotNumber(t, "Line: pointOnLine: t");

    return line.p1.add(line.dir.mul(t));
  }
  pointOnLine(t) {
    return Line.pointOnLine(this, t);
  }

  static pointWithX(line, x) {
    throwIfNotType(line, Line, "Line: pointWithX: line");
    throwIfNotNumber(x, "Line: pointWithX: x");
    if (line.dir.x === 0) {
      throw new Error("Cannot find point with x on vertical line!");
    }
    return line.pointOnLine((x - line.p1.x) / line.dir.x);
  }
  pointWithX(x) {
    throwIfNotNumber(x, "Line: pointWithX: x");
    return Line.pointWithX(this, x);
  }

  static intersect(line1, line2) {
    throwIfNotType(line1, Line, "Line: intersect: line1");
    throwIfNotType(line2, Line, "Line: intersect: line2");

    const denom = line1.dir.x * line2.dir.y - line1.dir.y * line2.dir.x;
    if (denom === 0) {
      throw new Error("Lines are parallel!");
    }
    const t = (line2.dir.x * (line1.p1.y - line2.p1.y) -
      line2.dir.y * (line1.p1.x - line2.p1.x)) / denom;
    return line1.pointOnLine(t);
  }

  static closestToPoint(line, point) {
    throwIfNotType(point, Vector, "Line: closestToPoint: point");
    throwIfNotType(line, Line, "Line: closestToPoint: line");

    const line2 = Line.fromDir(point, line.dir.perp());
    return Line.intersect(line, line2);
  }
  closestToPoint(point) {
    return Line.closestToPoint(this, point);
  }
}
