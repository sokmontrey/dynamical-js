import LineShape, { LineShapeParams } from "./LineShape";

export interface SolidShapeParams extends LineShapeParams {
	is_fill?: boolean;
	fill_color?: string;
}

export default class SolidShape extends LineShape {
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
