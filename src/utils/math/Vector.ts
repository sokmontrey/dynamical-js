export const vec2 = (x: number, y: number) => new Vec2(x, y);

export default class Vec2 {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add = (other: Vec2) => vec2(this.x + other.x, this.y + other.y);
	sub = (other: Vec2) => vec2(this.x - other.x, this.y - other.y);
	mul = (other: number) => vec2(this.x * other, this.y * other);
	mag = () => Math.sqrt(this.x * this.x + this.y * this.y);

	div = (other: number) => {
		if (!other) throw new Error("Cannot divide by zero");
		return new Vec2(this.x / other, this.y / other);
	}

	distance = (other: Vec2) => this.sub(other).mag();
	invert = () => vec2(-this.x, -this.y);
	norm = () => this.div(this.mag());
	toArray = () => [this.x, this.y];
	copy = () => vec2(this.x, this.y);

	static right = (length: number = 1) => vec2(length, 0);
	static left = (length: number = 1) => vec2(-length, 0);
	static up = (length: number = 1) => vec2(0, -length);
	static down = (length: number = 1) => vec2(0, length);
	static zero = () => vec2(0, 0);
	static one = () => vec2(1, 1);
	static fromPolar = (theta: number, r: number) => vec2(r * Math.cos(theta), r * Math.sin(theta));
}
