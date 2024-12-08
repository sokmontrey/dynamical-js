export default interface IRenderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): IRenderer;
}