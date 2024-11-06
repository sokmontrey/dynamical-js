import Vec2 from "../utils/math/Vector";
import Shape from "./Shape";

export interface LineShapeParams {
	is_stroke?: boolean;
	stroke_color?: string;
	line_width?: number;
}

export default class LineShape extends Shape {
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

