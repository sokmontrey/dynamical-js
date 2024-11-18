import Draw from "../core/Draw";
import Quadtree from "../quadtree/Quadtree";
import ShapeStyle from "../style/ShapeStyle";
import Vec2 from "../utils/math/Vector";
import Renderer from "./Renderer";

export default class QuadtreeRenderer<T> implements Renderer {
	private quadtree: Quadtree<T>;

	public readonly division: ShapeStyle;

	constructor(quadtree: Quadtree<T>) {
		this.quadtree = quadtree;
		this.division = new ShapeStyle()
			.noFill()
			.stroke()
			.setStrokeColor('white')
			.setLineWidth(1);
	}

	draw(ctx: CanvasRenderingContext2D, _: number): Renderer {
		this.drawDivisions(ctx);
		return this;
	}

	drawDivisions(ctx: CanvasRenderingContext2D, style: ShapeStyle = this.division) {
		if (!this.division.isEnable()) return;
		const lower = this.quadtree.getLower();
		const dim = this.quadtree.getDim();
		Draw.rectangle(ctx, lower, dim, style);
		if (!this.quadtree.isSubdivided()) return;
		const sub_quads = this.quadtree.getSubQuads();
		for (const q of sub_quads) q?.renderer.drawDivisions(ctx, style);
	}
}
