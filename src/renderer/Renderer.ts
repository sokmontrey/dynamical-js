import Vec2 from "../utils/math/Vector";

export default interface Renderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;
}
