import Canvas from "../interfaces/Canvas";
import Vec2 from "../utils/math/Vector";
import PointMass from "./PointMass";

export interface LinkParams {
	stiffness?: number;
};

export default class Link {
	point1: PointMass;
	point2: PointMass;
	stiffness: number;
	rest_dist: number = 0;
	resolve: Function = () => { };

	constructor(
		point1: PointMass,
		point2: PointMass,
		{
			// of [0, 1], 0 = completely loose, 1 = solid (depend on #iternation)
			stiffness = 1,
		}: LinkParams = {}) {

		this.point1 = point1;
		this.point2 = point2;
		this.calculateRestDistance();
		this.stiffness = stiffness;
	}

	calculateRestDistance(): number {
		const pos1 = this.point1.getPosition();
		const pos2 = this.point2.getPosition();
		return this.rest_dist = pos1.distance(pos2);
	}

	check() {
		if (this.point1.isStatic() && this.point2.isStatic())
			return this;
		const pos1 = this.point1.getPosition();
		const pos2 = this.point2.getPosition();

		const pos1_to_pos2 = pos2.sub(pos1);
		const curr_dist = pos1_to_pos2.mag();
		let diff = curr_dist - this.rest_dist;
		if (diff <= 1e-9 && diff >= -1e-9) return this; // too close to 0, do nothing

		diff *= this.stiffness;
		const dir = pos1_to_pos2.norm();

		if (this.point1.isStatic())
			this.resolve = () => Link.resolveOne(this.point2, dir.invert(), diff);
		else if (this.point2.isStatic())
			this.resolve = () => Link.resolveOne(this.point1, dir, diff);
		else
			this.resolve = () => Link.resolveBoth(this.point1, this.point2, dir, diff);
		return this;
	}

	static resolveOne(point: PointMass, dir: Vec2, correction: number) {
		const pos = point.getPosition();
		const new_pos = pos.add(dir.scale(correction));
		point.setPosition(new_pos);
	}

	static resolveBoth(point1: PointMass, point2: PointMass, dir: Vec2, correction: number) {
		const m1 = point1.getMass();
		const m2 = point2.getMass();
		Link.resolveOne(point1, dir, m2 * correction / (m1 + m2));
		Link.resolveOne(point2, dir.invert(), m1 * correction / (m1 + m2));
	}

	draw(canvas: Canvas) {
		const ctx = canvas.ctx;
		if (!ctx) return;
		const pos1 = this.point1.getPosition();
		const pos2 = this.point2.getPosition();
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x, pos2.y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
	}
}
