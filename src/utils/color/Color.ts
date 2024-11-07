import { lerp } from "../math/Basic";

export const color = (r:number, g:number, b:number, a:number = 1) => new Color(r,g,b,a); 

export default class Color {
	public r: number;
	public g: number;
	public b: number;
	public a: number;

	constructor(r: number, g: number, b: number, a: number = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	toRGBA() { return `rgba(${this.r},${this.g},${this.b},${this.a})`; }

	/**
	*	Linear interpolation between two colors
	*	i: 0 -> 1
	**/
	static lerp(c1: Color, c2: Color, i: number) {
		return color(
			lerp(c1.r, c2.r, i), 
			lerp(c1.g, c2.g, i), 
			lerp(c1.b, c2.b, i),
			lerp(c1.a, c2.a, i)
		);
	}
}
