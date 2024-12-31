import { lerp } from "./BasicMath";

export const color = (r: number, g: number, b: number) => new Color(r, g, b);

export default class Color {
	public r: number;
	public g: number;
	public b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	toStringRGB() { 
		return `rgba(${this.r},${this.g},${this.b})`; 
	}

	toString() {
		return this.toStringRGB();
	}

	toArrayRGB() { 
		return [this.r, this.g, this.b]; 
	}

	/**
	*	Linear interpolation between two colors
	*	i: 0 -> 1
	**/
	static lerp(c1: Color, c2: Color, i: number) {
		return color(
			lerp(c1.r, c2.r, i),
			lerp(c1.g, c2.g, i),
			lerp(c1.b, c2.b, i),
		);
	}

	static fromHex(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? new Color(
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		) : color(0, 0, 0);
	}

	static sel = '#3390ff';
	static sel_light = '#3390ff44';
	static bg = '#1B1C1E';
	static txt = '#E5E5E4';
	static sec_txt = '#cbcbc9';
	static prm = '#222324';
	static sur = '#303133';
	static border = '#333334';
	static acc = '#E7E77F';
	static sec = '#e7ac7f';
}
