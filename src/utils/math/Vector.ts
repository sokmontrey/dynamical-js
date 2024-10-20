export default class Vec2 {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y); }
	sub(other: Vec2): Vec2 { return new Vec2(this.x - other.x, this.y - other.y); }
	scale(other: number): Vec2 { return new Vec2(this.x * other, this.y * other); }
	mag(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }

	div(other: number): Vec2 {
		if (!other) throw new Error("Cannot divide by zero");
		return new Vec2(this.x / other, this.y / other);
	}
	eleDiv(other: Vec2): Vec2 {
		if (!other.x || !other.y) throw new Error("Cannot divide by zero");
		return new Vec2(this.x / other.x, this.y / other.y);
	}

	distance(other: Vec2): number { return this.sub(other).mag(); }
	invert(): Vec2 { return new Vec2(-this.x, -this.y); }
	norm(): Vec2 { return this.div(this.mag()); }
	toArray() { return [this.x, this.y]; }
	copy(): Vec2 { return new Vec2(this.x, this.y); }

	static right(length: number = 1): Vec2 { return new Vec2(length, 0); }
	static left(length: number = 1): Vec2 { return new Vec2(-length, 0); }
	static up(length: number = 1): Vec2 { return new Vec2(0, -length); }
	static down(length: number = 1): Vec2 { return new Vec2(0, length); }
	static zero(): Vec2 { return new Vec2(0, 0); }
	static one(): Vec2 { return new Vec2(1, 1); }

	static fromPolar(theta: number, r: number): Vec2 {
		return new Vec2(r * Math.cos(theta), r * Math.sin(theta));
	}
	static fromArray(arr: number[]): Vec2 {
		if (arr.length != 2)
			throw new Error(`Invalid array size (required 2 elements)`);
		return new Vec2(arr[0], arr[1]);
	}
}
