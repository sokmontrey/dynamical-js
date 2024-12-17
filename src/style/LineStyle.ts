import Style, { StyleProps } from "./Style";

export interface LineStyleProps extends StyleProps {
	is_stroke?: boolean,
	stroke_color?: string,
	line_width?: number,
}

export default class LineStyle extends Style {
	public is_stroke: boolean = true;
	public stroke_color: string = 'lightgray';
	public line_width: number = 3;

	constructor(params: LineStyleProps = {}) {
		super(params);
		Object.assign(this, params);
	}
}

