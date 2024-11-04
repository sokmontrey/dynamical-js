export interface RendererParams {
	is_fill?: boolean;
	is_stroke?: boolean;
	fill_color?: string;
	stroke_color?: string;
	line_width?: number;
};

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

}

}
