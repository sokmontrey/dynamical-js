import Vec2 from "../utils/math/Vector";

export interface LineShapeParams {
	is_stroke?: boolean;
	stroke_color?: string;
	line_width?: number;
}

export interface ArrowShapeParams extends LineShapeParams {
	is_head?: boolean;
	head_size?: number;
	length_scale?: number;
	head_color?: string;
}

export interface SolidShapeParams extends LineShapeParams {
	is_fill?: boolean;
	fill_color?: string;
}

export interface CircleShapeParams extends SolidShapeParams {
	radius?: number;
}

export class Shape {
	protected is_enable = true;
	enable() { this.is_enable = true; return this; }
	disable() { this.is_enable = false; return this; }
	applyStyleToContext(_: CanvasRenderingContext2D): void { }
};

export class LineShape extends Shape {
	protected is_stroke: boolean;
	protected stroke_color: string;
	protected line_width: number;

	constructor({
		is_stroke = true,
		stroke_color = 'lightgray',
		line_width = 3,
	}: LineShapeParams = {}) {
		super();
		this.is_stroke = is_stroke;
		this.stroke_color = stroke_color;
		this.line_width = line_width;
	}

	stroke() { this.is_stroke = true; return this; }
	noStroke() { this.is_stroke = false; return this; }
	setStrokeColor(color: string) { this.stroke_color = color; return this; }
	setLineWidth(line_width: number) { this.line_width = line_width; return this; }
	applyStyleToContext(ctx: CanvasRenderingContext2D) {
		if (this.is_stroke) {
			ctx.strokeStyle = this.stroke_color;
			ctx.lineWidth = this.line_width;
			ctx.stroke();
		}
	}
	draw(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2) {
		if (!this.is_enable) return;
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.closePath();
		this.applyStyleToContext(ctx);
	}
}

export class SolidShape extends LineShape {
	protected is_fill: boolean;
	protected fill_color: string;

	constructor({
		is_fill = true,
		fill_color = 'teal',
		...rest_params
	}: SolidShapeParams = {}) {
		super(rest_params);
		this.is_fill = is_fill;
		this.fill_color = fill_color;
	}

	fill() { this.is_fill = true; return this; }
	noFill() { this.is_fill = false; return this; }
	setFillColor(color: string) { this.fill_color = color; return this; }
	applyStyleToContext(ctx: CanvasRenderingContext2D) {
		if (this.is_fill) {
			ctx.fillStyle = this.fill_color;
			ctx.fill();
		}
		super.applyStyleToContext(ctx);
		return this;
	}
}

export class CircleShape extends SolidShape {
	protected radius: number;

	constructor({
		radius = 5,
		...rest_params
	}: CircleShapeParams = {}) {
		super(rest_params);
		this.radius = radius;
	}

	setRadius(radius: number) { this.radius = radius; return this; }
	draw(ctx: CanvasRenderingContext2D, pos: Vec2) {
		if (!this.is_enable) return;
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, this.radius, 0, 2 * Math.PI);
		ctx.closePath();
		this.applyStyleToContext(ctx);
	}
}

export class ArrowShape extends LineShape {
	protected is_head: boolean;
	protected head_color: string;
	protected head_size: number;
	protected length_scale: number;

	constructor({
		is_head = true,
		head_color = 'black',
		head_size = 10,
		length_scale = 500,
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

	drawHead(ctx: CanvasRenderingContext2D, arrow_vector: Vec2, head_pos: Vec2) {
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

	draw(ctx: CanvasRenderingContext2D, origin: Vec2, arrow_vector: Vec2) {
		if (!this.is_enable) return;
		arrow_vector = arrow_vector.mul(this.length_scale);
		const head_pos = origin.add(arrow_vector);
		// could be at head_base instead of head_pos for outline
		super.draw(ctx, origin, head_pos);
		this.drawHead(ctx, arrow_vector, head_pos);
	}
}
