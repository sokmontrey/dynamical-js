import LineStyle, { LineStyleParams } from "./LineStyle";

export interface ShapeStyleParams extends LineStyleParams {
	is_fill?: boolean;
	fill_color?: string;
}

export default class ShapeStyle extends LineStyle {
	public is_fill: boolean;
	public fill_color: string;

	constructor({
		is_fill = true,
		fill_color = 'teal',
		...rest_params
	}: ShapeStyleParams = {}) {
		super(rest_params);
		this.is_fill = is_fill;
		this.fill_color = fill_color;
	}

	//================================ Setters ================================

	setFillColor(color: string) {
		this.fill_color = color;
		return this;
	}

	noFill() {
		this.is_fill = false;
		return this;
	}

	fill() {
		this.is_fill = true;
		return this;
	}

	//================================ Getters ================================

	isFill() {
		return this.is_fill;
	}

	getFillColor() {
		return this.fill_color;
	}
}

