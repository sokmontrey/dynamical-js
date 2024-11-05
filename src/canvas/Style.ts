import Vec2 from "../utils/math/Vector";

export interface LineShapeParams {
	is_stroke?: boolean;
	stroke_color?: string;
	line_width?: number;
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
}
