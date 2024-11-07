import Color from "../utils/color/Color";

export interface Style {
	is_enable: boolean;
}

export interface SolidStyle {
	is_fill: boolean;
	fill_color: string;
}

export interface LineStyle {
	is_stroke: boolean;
	stroke_color: string;
	line_width: number;
}

export interface ArrowStyle {
	head_size: number;
}

export interface CircleStyle {
	radius: number;
}

export interface StressStyle {
	compress_color: Color;
	tension_color: Color;
}
