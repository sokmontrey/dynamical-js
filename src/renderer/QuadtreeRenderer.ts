import Draw from "../core/Draw";
import Quadtree from "../utils/Quadtree.ts";
import ShapeStyle from "../style/ShapeStyle";
import IRenderer from "./IRenderer.ts";

export default class QuadtreeRenderer implements IRenderer {
	private quadtree: Quadtree;

	public readonly division: ShapeStyle;

	constructor(quadtree: Quadtree) {
		this.quadtree = quadtree;
		this.division = new ShapeStyle()
			.noFill()
			.stroke()
			.setStrokeColor('white')
			.setLineWidth(1);
	}

	draw(ctx: CanvasRenderingContext2D, _: number): IRenderer {
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

	drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
		return this;
	}
}
