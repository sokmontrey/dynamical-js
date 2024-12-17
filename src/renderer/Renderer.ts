export default interface Renderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): void;
	drawSelection(ctx: CanvasRenderingContext2D): void;
}
