import Vec2 from "../utils/math/Vector";
import SolidShape, { SolidShapeParams } from "./SolidShape";

export interface CircleShapeParams extends SolidShapeParams {
	radius?: number;
}

export default class CircleShape extends SolidShape {
	protected radius: number;

	constructor({
		radius = 5,
		...rest_params
	}: CircleShapeParams = {}) {
		super(rest_params);
		this.radius = radius;
	}

	setRadius(radius: number) { this.radius = radius; return this; }
	draw(ctx: CanvasRenderingContext2D, pos: Vec2, _: number) {
		if (!this.is_enable) return;
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, this.radius, 0, 2 * Math.PI);
		ctx.closePath();
		this.applyStyleToContext(ctx);
	}
}

