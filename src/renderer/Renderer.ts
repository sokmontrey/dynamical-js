import Vec2 from "../utils/math/Vector";

export default interface Renderer {
	draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;

	/**
	* @return [top-left, bottom-right]
	**/
	getBoundingBox(): [Vec2, Vec2];
}
