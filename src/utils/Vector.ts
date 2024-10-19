export default class Vec2 {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	static zero(): Vec2 {
		return new Vec2(0, 0);
	}
	static one(): Vec2 {
		return new Vec2(1, 1);
	}
	static fromArray(arr: number[]): Vec2 {
		if (arr.length != 2)
			throw new Error(`Invalid array size (required 2 elements)`);
		return new Vec2(arr[0], arr[1]);
	}
}
