export class Shape {
	protected is_enable = true;
	enable() { this.is_enable = true; return this; }
	disable() { this.is_enable = false; return this; }
	applyStyleToContext(_: CanvasRenderingContext2D): void { }
};
