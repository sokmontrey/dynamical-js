export default abstract class Renderer {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;
}
