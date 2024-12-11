export default interface IRenderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer;
	drawSelection(ctx: CanvasRenderingContext2D): IRenderer;
}
