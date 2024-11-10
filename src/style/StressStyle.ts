import Color from "../utils/color/Color";
import Style, { StyleParams } from "./Style";

export interface StressStyleParams extends StyleParams {
	compress_color?: Color;
	tension_color?: Color;
}

export default class StressStyle extends Style {
	public compress_color: Color;
	public tension_color: Color;

	constructor({
		compress_color = Color.fromHex("#00d4ff"),
		tension_color = Color.fromHex("#ff2100"),
		...rest_params
	}: StressStyleParams = {}) {
		super(rest_params)
		this.compress_color = compress_color;
		this.tension_color = tension_color;
	}

	//================================ Setters ================================

	setCompressColor(color: Color) {
		this.compress_color = color;
		return this;
	}

	setTensionColor(color: Color) {
		this.tension_color = color;
		return this;
	}

	//================================ Getters ================================
	
	getCompressColor() {
		return this.compress_color;
	}

	getTensionColor() {
		return this.tension_color;
	}
}
