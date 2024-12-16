import Draw from "../core/Draw";
import RigidConstraint from "../core-physic/RigidConstraint";
import LineStyle, {LineStyleParams} from "../style/LineStyle";
import StressStyle, {StressStyleParams} from "../style/StressStyle";
import Color from "../utils/Color.ts";
import Vec2 from "../utils/Vector.ts";
import IRenderer from "./IRenderer.ts";
import CircleStyle, {CircleStyleParams} from "../style/CircleStyle.ts";

export interface RigidConstraintRendererParams {
	constraint_line?: LineStyleParams;
	stress?: StressStyleParams;
	selected?: LineStyleParams;
	selected_circle?: CircleStyleParams;
}

export default class RigidConstraintRenderer implements IRenderer {
	protected rigid_constraint: RigidConstraint;

	public readonly constraint_line;
	public readonly stress;

	public readonly selected: LineStyle;
	public readonly selected_circle: CircleStyle;

	constructor(rigid_constraint: RigidConstraint, {
		constraint_line = {},
		stress = { is_enable: false },
		selected = { line_width: 2, stroke_color: '#0390fc' },
		selected_circle = { radius: 4, fill_color: '#0390fc', is_stroke: false }
	}: RigidConstraintRendererParams = {}) {
		this.rigid_constraint = rigid_constraint;

		this.constraint_line = new LineStyle(constraint_line);
		this.stress = new StressStyle(stress);
		this.selected = new LineStyle(selected);
		this.selected_circle = new CircleStyle(selected_circle);
	}

	private applyStress(_: CanvasRenderingContext2D, steps: number) {
		if (!this.stress.isEnable()) return;
		// multiply with 1000 * steps to amplify the visual (+ 1/2 offset)
		let stress = this.rigid_constraint.getStress();
		stress = stress * steps * steps * 10 + 0.5; // scale by 10 * steps ^ 2 + offset
		this.constraint_line.stroke_color = Color.lerp(
			this.stress.compress_color,
			this.stress.tension_color,
			stress,
		).toStringRGB();
	}

	private drawConstraintLine(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2) {
		if (!this.constraint_line.isEnable()) return;
		Draw.line(ctx, start, end, this.constraint_line);
	}

	public draw(ctx: CanvasRenderingContext2D, steps: number) {
		const [pm1, pm2] = this.rigid_constraint.getPointMasses();
		const start = pm1.getPosition();
		const end = pm2.getPosition();
		this.applyStress(ctx, steps);
		this.drawConstraintLine(ctx, start, end);
		return this;
	}

	drawSelection(ctx: CanvasRenderingContext2D): IRenderer {
		const [pm1, pm2] = this.rigid_constraint.getPointMasses();
		Draw.circle(ctx, pm1.getPosition(), this.selected_circle);
		Draw.circle(ctx, pm2.getPosition(), this.selected_circle);
		Draw.line(ctx, pm1.getPosition(), pm2.getPosition(), this.selected);
		return this;
	}
}

