import ShapeStyle, { ShapeStyleProps } from "./ShapeStyle";

export interface CircleStyleProps extends ShapeStyleProps {
	radius?: number;
}

export default class CircleStyle extends ShapeStyle {
	public radius: number = 5;

	constructor(params: CircleStyleProps = {}) {
		super(params);
		Object.assign(this, params);
	}
}

