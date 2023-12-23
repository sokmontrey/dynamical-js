export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
  }
  add(b) {
    return Vector.add(this, b);
  }

  static addMag(a, b) {
    return a.add(a.norm().mul(b));
  }

  static sub(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }
  sub(b) {
    return Vector.sub(this, b);
  }

  static neg(vec) {
    return new Vector(-vec.x, -vec.y);
  }
  neg() {
    return Vector.neg(this);
  }

  static mul(a, b) {
    if (typeof b === 'number') { b = Vector.numToVec(b); } 
    return new Vector(a.x * b.x, a.y * b.y);
  }
  mul(b) {
    return Vector.mul(this, b);
  }

  static div(a, b) {
    if (typeof b === 'number') { 
      b = Vector.numToVec(b); 
    }
    if (b.x === 0 || b.y === 0) {
      console.error('Cannot divide by zero!');
    }
    return new Vector(a.x / b.x, a.y / b.y);
  }
  div(b) {
    return Vector.div(this, b);
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  dot(b) {
    return Vector.dot(this, b);
  }

  static mag(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  }
  mag() {
    return Vector.mag(this);
  }

  static scale(vec, mag) {
    return vec.norm().mul(mag);
  }
  scale(mag) {
    return Vector.scale(this, mag);
  }

  static norm(vec) {
    return Vector.div(vec, vec.mag());
  }
  norm() {
    return Vector.norm(this);
  }

  static perp(vec) {
    return new Vector(-vec.y, vec.x);
  }
  perp() {
    return Vector.perp(this);
  }

  static scalarProj(a, b) {
    return Vector.dot(a, b) / Vector.mag(b);
  }
  scalarProj(b) {
    return Vector.scalarProj(this, b);
  }

  static proj(a, b) {
    return b.norm().mul(Vector.scalarProj(a, b));
  }
  proj(b) {
    return Vector.proj(this, b);
  }

  static dist(a, b) {
    return Vector.sub(a, b).mag();
  }
  dist(b) {
    return Vector.dist(this, b);
  }

  static copy(vec) {
    return new Vector(vec.x, vec.y);
  }
  copy() {
    return Vector.copy(this);
  }

  static numToVec(num) {
    return new Vector(num, num);
  }

  static componentParaTo(a, b) {
    return Vector.proj(a, b).mag();
  }
  componentParaTo(b) {
    return Vector.componentParaTo(this, b);
  }

  static componentPerpTo(a, b) {
    return Vector.sub(a, Vector.proj(a, b)).mag();
  }
  componentPerpTo(b) {
    return Vector.componentPerpTo(this, b);
  }

  static zero() {
    return Vector.numToVec(0);
  }
} 
