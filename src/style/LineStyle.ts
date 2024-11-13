import Style, { StyleParams } from "./Style";

export interface LineStyleParams extends StyleParams {
	is_stroke?: boolean,
	stroke_color?: string,
	line_width?: number,
}

export default class LineStyle extends Style {
	public is_stroke: boolean;
	public stroke_color: string;
	public line_width: number;

	constructor({
		is_stroke = true,
		stroke_color = 'lightgray',
		line_width = 3,
		...rest_params
	}: LineStyleParams = {}) {
		super(rest_params);
		this.is_stroke = is_stroke;
		this.stroke_color = stroke_color;
		this.line_width = line_width;
	}

	//================================ Setters ================================

	stroke() {
		this.is_stroke = true;
		return this;
	}

	noStroke() {
		this.is_stroke = false;
		return this;
	}

	setStrokeColor(color: string) {
		this.stroke_color = color;
		return this;
	}

	setLineWidth(line_width: number) {
		this.line_width = line_width;
		return this;
	}

	//================================ Getters ================================

	isStroke() {
		return this.is_stroke;
	}

	getStrokeColor() {
		return this.stroke_color;
	}

	getLineWidth() {
		return this.line_width;
	}
}

