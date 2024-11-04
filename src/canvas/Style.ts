export interface LineStyleParams {
	is_stroke?: boolean;
	stroke_color?: string;
	line_width?: number;
}

export interface SolidStyleParams extends LineStyleParams {
	is_fill?: boolean;
	fill_color?: string;
}

export interface CircleStyleParams extends SolidStyleParams {
	radius?: number;
}

export class Style {
	protected is_enable = true;
	enable() { this.is_enable = true; return this; }
	disable() { this.is_enable = false; return this; }
	isEnable() { return this.is_enable; }
	applyStyleToContext(_: CanvasRenderingContext2D): Style { return this; };
};

export class LineStyle extends Style {
	protected is_stroke: boolean;
	protected stroke_color: string;
	protected line_width: number;

	constructor({
		is_stroke = true,
		stroke_color = 'lightgray',
		line_width = 3,
	}: LineStyleParams = {}) {
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
		return this;
	}
}

export class SolidStyle extends LineStyle{
	protected is_fill: boolean;
	protected fill_color: string;

	constructor({
		is_fill = true,
		fill_color = 'teal',
		...rest_params
	}: SolidStyleParams = {}) {
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

export class CircleStyle extends SolidStyle {
	protected radius: number;

	constructor({
		radius = 5,
		...rest_params
	}: CircleStyleParams = {}) {
		super(rest_params);
		this.radius = radius;
	}

	setRadius(radius: number) { this.radius = radius; return this; }
	getRadius() { return this.radius; }
}
