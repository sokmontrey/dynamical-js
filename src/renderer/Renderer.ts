export default interface Renderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;
}
