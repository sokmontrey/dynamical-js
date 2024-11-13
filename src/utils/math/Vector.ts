export const vec2 = (x: number, y: number) => new Vec2(x, y);

export default class Vec2 {
	public readonly x: number = 0;
	public readonly y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	//================================ Math operations ================================

	add(other: Vec2) {
		return vec2(this.x + other.x, this.y + other.y);
	}

	/**
	*	Subtract the other vector from the current vector
	**/
	sub(other: Vec2) {
		return vec2(this.x - other.x, this.y - other.y);
	}

	/**
	*	Multiply current vector with a scalar
	**/
	mul(value: number) {
		return vec2(this.x * value, this.y * value);
	}

	dot(other: Vec2) {
		return this.x * other.x + this.y * other.y;
	}

	/**
	*	Get magnitude of the current vector
	**/
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	div(other: number) {
		if (!other) throw new Error("Cannot divide by zero");
		return new Vec2(this.x / other, this.y / other);
	}

	distance(other: Vec2) {
		return this.sub(other).mag();
	}

	/**
	*	Equivalent to multiply the current vector by -1
	**/
	invert() {
		return vec2(-this.x, -this.y);
	}

	/**
	*	Get the clockwise perpendicular vector
	**/
	perp() {
		return vec2(this.y, -this.x);
	}

	/**
	*	Normalize the vector
	*	@return a unit Vec2 of the original vector
	**/
	norm() {
		return this.div(this.mag());
	}

    abs(): Vec2 {
		return vec2(Math.abs(this.x), Math.abs(this.y));
    }

	//================================ Conveniences ================================

	/**
	*	Whether the point is inside a bounding box
	*	@param lower top-left (negative y for above x axis)
	*	@param upper bottom-right (negative y for above x axis)
	**/
	isInBoundingBox(lower: Vec2, upper: Vec2) {
		return this.x >= lower.x &&
			this.x <= upper.x &&
			this.y >= lower.y &&
			this.y <= upper.y;
	}

	/**
	*	@return [x, y]
	**/
	toArray() {
		return [this.x, this.y];
	}

	/**
	*	Create a copy of the original vector.
	*	Preventing JavaScript object reference
	**/
	copy() {
		return vec2(this.x, this.y);
	}

	//================================ Four Direction Translation ================================

	/**
	*	Create a copy of the vector - moved to the right by "unit"
	**/
	right(unit: number = 1) {
		return this.add(vec2(unit, 0));
	}

	/**
	*	Create a copy of the vector - moved to the left by "unit"
	**/
	left(unit: number = 1) {
		return this.add(vec2(-unit, 0));
	}

	/**
	*	Create a copy of the vector - moved up by "unit"
	**/
	up(unit: number = 1) {
		return this.add(vec2(0, -unit));
	}

	/**
	*	Create a copy of the vector - moved down by "unit"
	**/
	down(unit: number = 1) {
		return this.add(vec2(0, unit));
	}

	/**
	*	Create a vector moved to the right by "unit"
	**/
	static right(unit: number = 1) {
		return vec2(unit, 0);
	}

	/**
	*	Create a vector moved to the left by "unit"
	**/
	static left(unit: number = 1) {
		return vec2(-unit, 0);
	}

	/**
	*	Create a vector moved up by "unit"
	**/
	static up(unit: number = 1) {
		return vec2(0, -unit);
	}

	/**
	*	Create a vector moved down by "unit"
	**/
	static down(unit: number = 1) {
		return vec2(0, unit);
	}

	/**
	*	Create a zero vector
	**/
	static zero() {
		return vec2(0, 0);
	}

	/**
	*	Create a vector with one for x and y
	**/
	static one() {
		return vec2(1, 1);
	}

	/**
	*	Create a vector from polar coordinate using standard trig formula
	*		(r cos(theta), r sin(theta))
	**/
	static fromPolar(theta: number, r: number) {
		return vec2(r * Math.cos(theta), r * Math.sin(theta));
	}
}
