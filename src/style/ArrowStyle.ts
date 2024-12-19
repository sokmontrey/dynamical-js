import ShapeStyle, { ShapeStyleProps } from "./ShapeStyle";

export interface ArrowStyleProps extends ShapeStyleProps {
	head_size?: number;
}

export default class ArrowStyle extends ShapeStyle {
	public head_size: number = 8;

	constructor(params: ArrowStyleProps = {}) {
		super(params);
		Object.assign(this, params);
	}
}
