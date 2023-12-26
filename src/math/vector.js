import { DynError, Graphic } from "../index.js";

export default class Vector {
  constructor(x, y) {
    DynError.throwIfNotNumber(x, "Vector: x");
    DynError.throwIfNotNumber(y, "Vector: y");

    this.x = x;
    this.y = y;

    this.graphic = new Graphic("white", "#dddd55")
      .noFill()
      .stroke()
      .setStrokeWidth(2);
    this.graphic.draw = (renderer, options = {}) => {
      if (!this.graphic.isVisible()) return;
      renderer.drawVector(this, ...Object.values(options));
      renderer.renderGraphic(this.graphic);
    };
  }

  static add(a, b) {
    Vector.checkNan(a, "add a");
    Vector.checkNan(b, "add b");
    return new Vector(a.x + b.x, a.y + b.y);
  }
  add(b) {
    return Vector.add(this, b);
  }

  static addMag(a, b) {
    Vector.checkNan(a, "addMag a");
    Vector.checkNan(b, "addMag b");
    return a.add(a.norm().mul(b));
  }

  static sub(a, b) {
    Vector.checkNan(a, "sub a");
    Vector.checkNan(b, "sub b");
    return new Vector(a.x - b.x, a.y - b.y);
  }
  sub(b) {
    return Vector.sub(this, b);
  }

  static neg(vec) {
    Vector.checkNan(vec, "neg");
    return new Vector(-vec.x, -vec.y);
  }
  neg() {
    return Vector.neg(this);
  }

  static rot(vec, deg) {
    Vector.checkNan(vec, "rot");
    const rad = deg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new Vector(vec.x * cos - vec.y * sin, vec.x * sin + vec.y * cos);
  }
  rot(deg) {
    return Vector.rot(this, deg);
  }

  static angle(vec) {
    Vector.checkNan(vec, "angle");
    return Math.atan2(vec.y, vec.x) * 180 / Math.PI;
  }
  angle() {
    return Vector.angle(this);
  }

  static angleBetween(a, b) {
    Vector.checkNan(a, "angleBetween a");
    Vector.checkNan(b, "angleBetween b");
    // angle start from a to b, 0 - 360
    return (360 + Vector.angle(b) - Vector.angle(a)) % 360;
  }
  angleBetween(b) {
    return Vector.angleBetween(this, b);
  }

  static mul(a, b) {
    if (typeof b === "number") b = Vector.numToVec(b);
    Vector.checkNan(a, "mul a");
    Vector.checkNan(b, "mul b");
    return new Vector(a.x * b.x, a.y * b.y);
  }
  mul(b) {
    return Vector.mul(this, b);
  }

  static div(a, b) {
    const new_b = typeof b === "number" ? Vector.numToVec(b) : b;
    Vector.checkNan(a, "div a");
    Vector.checkNan(new_b, "div b");
    if (new_b.x === 0 || new_b.y === 0) {
      throw new Error("Cannot divide by zero!");
    }
    return new Vector(a.x / new_b.x, a.y / new_b.y);
  }
  div(b) {
    return Vector.div(this, b);
  }

  static dot(a, b) {
    Vector.checkNan(a, "dot a");
    Vector.checkNan(b, "dot b");
    return a.x * b.x + a.y * b.y;
  }
  dot(b) {
    return Vector.dot(this, b);
  }

  static mag(vec) {
    Vector.checkNan(vec, "mag");
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  }
  mag() {
    return Vector.mag(this);
  }

  static min(a, b) {
    Vector.checkNan(a, "min a");
    Vector.checkNan(b, "min b");
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }
  min(b) {
    return Vector.min(this, b);
  }

  static max(a, b) {
    Vector.checkNan(a, "max a");
    Vector.checkNan(b, "max b");
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }
  max(b) {
    return Vector.max(this, b);
  }

  static lt(a, b) {
    Vector.checkNan(a, "lessThan a");
    Vector.checkNan(b, "lessThan b");
    return a.x < b.x && a.y < b.y;
  }
  lt(b) {
    return Vector.lessThan(this, b);
  }

  static gt(a, b) {
    Vector.checkNan(a, "greaterThan a");
    Vector.checkNan(b, "greaterThan b");
    return a.x > b.x && a.y > b.y;
  }
  gt(b) {
    return Vector.greaterThan(this, b);
  }

  static lte(a, b) {
    Vector.checkNan(a, "lessThanEqualTo a");
    Vector.checkNan(b, "lessThanEqualTo b");
    return a.x <= b.x && a.y <= b.y;
  }
  lte(b) {
    return Vector.lessThanEqualTo(this, b);
  }

  static scale(vec, mag) {
    Vector.checkNan(vec, "scale");
    return vec.norm().mul(mag);
  }
  scale(mag) {
    return Vector.scale(this, mag);
  }

  static norm(vec) {
    Vector.checkNan(vec, "norm");
    return Vector.div(vec, vec.mag());
  }
  norm() {
    return Vector.norm(this);
  }

  static perp(vec) {
    Vector.checkNan(vec, "perp");
    return new Vector(-vec.y, vec.x);
  }
  perp() {
    return Vector.perp(this);
  }

  static scalarProj(a, b) {
    Vector.checkNan(a, "scalarProj a");
    Vector.checkNan(b, "scalarProj b");
    return Vector.dot(a, b) / Vector.mag(b);
  }
  scalarProj(b) {
    return Vector.scalarProj(this, b);
  }

  static proj(a, b) {
    Vector.checkNan(a, "proj a");
    Vector.checkNan(b, "proj b");
    return b.norm().mul(Vector.scalarProj(a, b));
  }
  proj(b) {
    return Vector.proj(this, b);
  }

  static dist(a, b) {
    Vector.checkNan(a, "dist a");
    Vector.checkNan(b, "dist b");
    return Vector.sub(a, b).mag();
  }
  dist(b) {
    return Vector.dist(this, b);
  }

  static copy(vec) {
    Vector.checkNan(vec, "copy");
    return new Vector(vec.x, vec.y);
  }
  copy() {
    return Vector.copy(this);
  }

  static numToVec(num) {
    if (isNaN(num)) {
      throw new Error("Vector.numToVec called with NaN!");
    }
    return new Vector(num, num);
  }

  static componentParaTo(a, b) {
    Vector.checkNan(a, "componentParaTo a");
    Vector.checkNan(b, "componentParaTo b");
    return Vector.proj(a, b).mag();
  }
  componentParaTo(b) {
    return Vector.componentParaTo(this, b);
  }

  static componentPerpTo(a, b) {
    Vector.checkNan(a, "componentPerpTo a");
    Vector.checkNan(b, "componentPerpTo b");
    return Vector.sub(a, Vector.proj(a, b)).mag();
  }
  componentPerpTo(b) {
    return Vector.componentPerpTo(this, b);
  }

  static zero() {
    return Vector.numToVec(0);
  }

  static isNaN(vec) {
    return isNaN(vec.x) || isNaN(vec.y);
  }

  static checkNan(vec, op_name) {
    DynError.throwIfNotType(vec, Vector, `Vector.${op_name}`);
    if (Vector.isNaN(vec)) {
      throw new Error(`Vector.${op_name}: called with NaN vector!`);
    }
  }
}
