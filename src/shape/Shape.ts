export default class Shape {
	protected is_enable = true;
	enable() { this.is_enable = true; return this; }
	disable() { this.is_enable = false; return this; }
	isEnable() { return this.is_enable; }
	applyStyleToContext(_: CanvasRenderingContext2D): void { }
};
