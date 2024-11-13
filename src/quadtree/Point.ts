import Vec2 from "../utils/math/Vector";

/**
* Generic 2D Vector carrying a single data unit.
* Used in Quadtree.
**/
export default class Point<T> {
	public pos: Vec2;
	public value: T;

	constructor(pos: Vec2, value: T) {
		this.pos = pos;
		this.value = value;
	}
}
