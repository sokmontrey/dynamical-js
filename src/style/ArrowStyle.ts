import ShapeStyle, { ShapeStyleParams } from "./ShapeStyle";

export interface ArrowStyleParams extends ShapeStyleParams {
	head_size?: number;
}

export default class ArrowStyle extends ShapeStyle {
	public head_size: number;

	constructor({
		head_size = 8,
		...rest_params
	}: ArrowStyleParams = {}) {
		super(rest_params);
		this.head_size = head_size;
	}

	//================================ Setters ================================

	setHeadSize(head_size: number) {
		this.head_size = head_size;
		return this;
	}

	//================================ Getters ================================

	getHeadSize() {
		return this.head_size;
	}

	getProps() {
		return {
			...super.getProps(),
			head_size: this.head_size,
		};
	}
}
