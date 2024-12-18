import Draw from "../core/Draw";
import RigidConstraint from "../core-physic/RigidConstraint";
import LineStyle, {LineStyleProps} from "../style/LineStyle";
import StressStyle, {StressStyleProps} from "../style/StressStyle";
import Color from "../utils/Color.ts";
import Vec2 from "../utils/Vector.ts";
import CircleStyle, {CircleStyleProps} from "../style/CircleStyle.ts";
import RendererProps from "./RendererProps.ts";
import Renderer from "./Renderer.ts";

export interface RigidConstraintRendererProps extends RendererProps {
	constraint_line?: LineStyleProps;
	stress?: StressStyleProps;
	selected?: LineStyleProps;
	selected_circle?: CircleStyleProps;
}

export default class RigidConstraintRenderer extends Renderer {
	private rigid_constraint: RigidConstraint;

	public readonly constraint_line: LineStyle;
	public readonly stress: StressStyle;
	public readonly selected: LineStyle;
	public readonly selected_circle: CircleStyle;

	constructor(rigid_constraint: RigidConstraint, {
		constraint_line = {},
		stress = { is_enable: false },
		selected = { line_width: 2, stroke_color: '#0390fc' },
		selected_circle = { radius: 4, fill_color: '#0390fc', is_stroke: false }
	}: RigidConstraintRendererProps = {}) {
		super();
		this.rigid_constraint = rigid_constraint;

		this.constraint_line = new LineStyle(constraint_line);
		this.stress = new StressStyle(stress);
		this.selected = new LineStyle(selected);
		this.selected_circle = new CircleStyle(selected_circle);
	}

	private applyStress(_: CanvasRenderingContext2D, steps: number) {
		if (!this.stress.is_enable) return;
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
		if (!this.constraint_line.is_enable) return;
		Draw.line(ctx, start, end, this.constraint_line);
	}

	public draw(ctx: CanvasRenderingContext2D, steps: number) {
		const [pm1, pm2] = this.rigid_constraint.getPointMasses();
		const start = pm1.getPosition();
		const end = pm2.getPosition();
		this.applyStress(ctx, steps);
		this.drawConstraintLine(ctx, start, end);
	}

	public drawSelection(ctx: CanvasRenderingContext2D) {
		const [pm1, pm2] = this.rigid_constraint.getPointMasses();
		Draw.circle(ctx, pm1.getPosition(), this.selected_circle);
		Draw.circle(ctx, pm2.getPosition(), this.selected_circle);
		Draw.line(ctx, pm1.getPosition(), pm2.getPosition(), this.selected);
	}
}

