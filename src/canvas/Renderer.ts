import PointMass from "../physic/PointMass";

export interface RendererParams {
	is_fill?: boolean;
	is_stroke?: boolean;
	fill_color?: string;
	stroke_color?: string;
	line_width?: number;
};

export interface PointMassRendererParams extends RendererParams {
	radius?: number;
}

export default class Renderer {
	protected is_fill: boolean;
	protected is_stroke: boolean;
	protected fill_color: string;
	protected stroke_color: string;
	protected line_width: number;

	constructor({
		is_fill = true,
		is_stroke = false,
		fill_color = "blue",
		stroke_color = "gray",
		line_width = 1,
	}: RendererParams = {}) {

		this.is_fill = is_fill;
		this.is_stroke = is_stroke;
		this.fill_color = fill_color;
		this.stroke_color = stroke_color;
		this.line_width = line_width;
	}

	applyStyle(ctx: CanvasRenderingContext2D) {
		if (this.is_fill) {
			ctx.fillStyle = this.fill_color;
			ctx.fill();
		}
		if (this.is_stroke) {
			ctx.strokeStyle = this.stroke_color;
			ctx.lineWidth = this.line_width;
			ctx.stroke();
		}
		return this;
	}

	fill() { this.is_fill = true; return this; }
	stroke() { this.is_stroke = true; return this; }
	noFill() { this.is_fill = false; return this; }
	noStroke() { this.is_stroke = false; return this; }

	setFillColor(color: string) { this.fill_color = color; return this; }
	setStrokeColor(color: string) { this.stroke_color = color; return this; }
	setLineWidth(line_width: number) { this.line_width = line_width; return this; }

	draw(_: CanvasRenderingContext2D) { return this; }
}

export class PointMassRenderer extends Renderer {
	protected pointmass: PointMass;
	protected radius: number;

	constructor(pointmass: PointMass, 
	{
		radius = 5,
		...rendererParams
	}: PointMassRendererParams = {}) {

		super(rendererParams);
		this.pointmass = pointmass;
		this.radius = radius;
	}

	setRadius(radius: number) {
		this.radius = radius;
		return this;
	}

}
