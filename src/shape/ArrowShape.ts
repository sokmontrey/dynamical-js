import Vec2 from "../utils/math/Vector";
import LineShape, { LineShapeParams } from "./LineShape";

export interface ArrowShapeParams extends LineShapeParams {
	is_head?: boolean;
	head_size?: number;
	length_scale?: number;
	head_color?: string;
}

export default class ArrowShape extends LineShape {
	protected is_head: boolean;
	protected head_color: string;
	protected head_size: number;
	protected length_scale: number;

	constructor({
		is_head = true,
		head_color = 'black',
		head_size = 10,
		length_scale = 1,
		...rest_params
	}: ArrowShapeParams = {}) {
		super(rest_params);
		this.is_head = is_head;
		this.head_color = head_color;
		this.head_size = head_size;
		this.length_scale = length_scale;
	}

	/**
	*	The scale of how long he length of the arrow will be drawn
	**/
	setLengthScale(scale: number) { this.length_scale = scale; return this; }
	setHeadSize(head_size: number) { this.head_size = head_size; return this; }

	drawHead(ctx: CanvasRenderingContext2D, arrow_vector: Vec2, head_pos: Vec2, _: number) {
		if (arrow_vector.mag() === 0) return;
		const invt_dir = arrow_vector.norm().invert();
		const perp_invt_dir = invt_dir.perp();
		const head_base = head_pos.add(invt_dir.mul(this.head_size));
		const barb1 = head_base.add(perp_invt_dir.mul(this.head_size * 0.6));
		const barb2 = head_base.add(perp_invt_dir.mul(this.head_size * -0.6));

		ctx.beginPath();
		ctx.moveTo(head_pos.x, head_pos.y);
		ctx.lineTo(barb1.x, barb1.y);
		ctx.lineTo(barb2.x, barb2.y);
		ctx.lineTo(head_pos.x, head_pos.y);
		ctx.closePath();
		if (this.is_head) { ctx.fillStyle = this.head_color; ctx.fill(); }
	}

	draw(ctx: CanvasRenderingContext2D, origin: Vec2, arrow_vector: Vec2, steps: number) {
		if (!this.is_enable) return;
		arrow_vector = arrow_vector.mul(this.length_scale * steps * 10);
		const head_pos = origin.add(arrow_vector);
		// could be at head_base instead of head_pos for outline
		super.draw(ctx, origin, head_pos, steps);
		this.drawHead(ctx, arrow_vector, head_pos, steps);
	}
}
