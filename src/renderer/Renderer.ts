import Vec2 from "../utils/math/Vector";

export default abstract class Renderer {
	abstract draw(ctx: CanvasRenderingContext2D, steps: number): Renderer;

	/**
	* @return [top-left, bottom-right]
	**/
	abstract getBoundingBox(): [Vec2, Vec2];
}
