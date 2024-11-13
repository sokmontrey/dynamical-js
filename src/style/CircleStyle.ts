import ShapeStyle, { ShapeStyleParams } from "./ShapeStyle";

export interface CircleStyleParams extends ShapeStyleParams {
	radius?: number;
}

export default class CircleStyle extends ShapeStyle {
	public radius: number;

	constructor({
		radius = 5,
		...rest_params
	}: CircleStyleParams = {}) {
		super(rest_params);
		this.radius = radius;
	}

	//================================ Setters ================================	

	setRadius(radius: number) {
		this.radius = radius;
		return this;
	}

	//================================ Getters ================================

	getRadius() {
		return this.radius;
	}
}

