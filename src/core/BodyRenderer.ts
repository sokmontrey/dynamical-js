export default abstract class BodyRenderer<T> {
	abstract draw(body: T, ctx: CanvasRenderingContext2D, steps: number): void;
	abstract drawSelection(body: T, ctx: CanvasRenderingContext2D): void;
}