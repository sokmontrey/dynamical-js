export default class Vec2 {
    mag(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
    }
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vec2): Vec2 {
		return new Vec2(this.x + other.x, this.y + other.y);
	}

	sub(other: Vec2): Vec2 {
		return new Vec2(this.x - other.x, this.y - other.y);
	}

	scale(other: number): Vec2 {
		return new Vec2(this.x * other, this.y * other);
	}

	toArray() {
		return [this.x, this.y];
	}

	copy(): Vec2 {
		return new Vec2(this.x, this.y);
	}

	static zero(): Vec2 {
		return new Vec2(0, 0);
	}
	static one(): Vec2 {
		return new Vec2(1, 1);
	}
	static fromXY(x: number, y: number): Vec2 {
		return new Vec2(x, y);
	}
	static fromPolar(theta: number, r: number): Vec2 {
		return new Vec2(r * Math.cos(theta), r * Math.sin(theta));
	}
	static fromArray(arr: number[]): Vec2 {
		if (arr.length != 2)
			throw new Error(`Invalid array size (required 2 elements)`);
		return new Vec2(arr[0], arr[1]);
	}
}
