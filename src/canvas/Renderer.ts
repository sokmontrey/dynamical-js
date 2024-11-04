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

}

}
