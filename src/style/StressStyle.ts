import Color from "../utils/Color.ts";
import Style, { StyleProps } from "./Style";

export interface StressStyleProps extends StyleProps {
	compress_color?: Color;
	tension_color?: Color;
}

export default class StressStyle extends Style {
	public compress_color: Color = Color.fromHex("#00d4ff");
	public tension_color: Color = Color.fromHex("#ff2100");

	constructor(params: StressStyleProps = {}) {
		super(params);
		Object.assign(this, params);
	}
}
