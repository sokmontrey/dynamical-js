import Canvas from "../interfaces/Canvas";
import Vec2 from "../utils/math/Vector";

export interface PointMassParams {
	pos?: Vec2;
	mass?: number;
	is_static?: boolean;
	acc?: Vec2;
};

export default class PointMass {
	pos: Vec2;
	oldpos: Vec2;
	acc: Vec2;
	mass: number;
	is_static: boolean;

	constructor({
		pos = Vec2.zero(),
		mass = 1,
		is_static = false,
		acc = Vec2.zero(),
	}: PointMassParams = {}) {

		this.pos = pos;
		this.oldpos = pos;
		this.acc = acc;
		this.mass = mass;
		this.is_static = is_static;
	}

	update(dt: number) {
		if (this.is_static) return;
		const temp_pos = this.pos.copy();
		this.pos = this.pos
			.sub(this.oldpos)
			.add(this.acc.scale(dt * dt))
			.add(this.pos);
		this.oldpos = temp_pos;
		this.acc = Vec2.zero();
	}

	setAcceleration(acc: Vec2) { this.acc = acc; }
	getPosition() { return this.pos; }
	setPosition(pos: Vec2) { this.pos = pos; }
	isStatic() { return this.is_static; }
	getMass() { return this.mass; }

	draw(canvas: Canvas) {
		const ctx = canvas.ctx;
		if (!ctx) return;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}
}

