import LineStyle, { LineStyleProps } from "./LineStyle";

export interface ShapeStyleProps extends LineStyleProps {
	is_fill?: boolean;
	fill_color?: string;
}

export default class ShapeStyle extends LineStyle {
	public is_fill: boolean = true;
	public fill_color: string = 'teal';

	constructor(params: ShapeStyleProps = {}) {
		super(params);
		Object.assign(this, params);
	}
}

