import BodyRenderer from "../../core/BodyRenderer";
import Draw from "../../core/Draw";
import CircleStyle, { CircleStyleProps } from "../../style/CircleStyle";
import LineStyle, { LineStyleProps } from "../../style/LineStyle";
import StressStyle, { StressStyleProps } from "../../style/StressStyle";
import Color from "../../utils/Color";
import Vec2 from "../../utils/Vector";
import RigidConstraint from "./Body";

export interface RendererProps {
	constraint_line?: LineStyleProps;
	stress?: StressStyleProps;
	selected?: LineStyleProps;
	selected_circle?: CircleStyleProps;
}

export default class RigidConstraint_Renderer extends BodyRenderer<RigidConstraint> {
	constraint_line: LineStyle;
	stress: StressStyle;
	selected: LineStyle;
	selected_circle: CircleStyle;

	constructor(props: RendererProps) {
		super();
		this.constraint_line = new LineStyle(props.constraint_line);
		this.stress = new StressStyle(props.stress);
		this.selected = new LineStyle(props.selected);
		this.selected_circle = new CircleStyle(props.selected_circle);
	}

	draw(rigid_constraint: RigidConstraint, ctx: CanvasRenderingContext2D, steps: number) {
		const [pm1, pm2] = rigid_constraint.getPointMasses();
		const start = pm1.getPosition();
		const end = pm2.getPosition();
		this.applyStress(rigid_constraint, steps);
		this.drawConstraintLine(ctx, start, end);
	}

	drawSelection(rigid_constraint: RigidConstraint, ctx: CanvasRenderingContext2D) {
		const [pm1, pm2] = rigid_constraint.getPointMasses();
		Draw.circle(ctx, pm1.getPosition(), this.selected_circle);
		Draw.circle(ctx, pm2.getPosition(), this.selected_circle);
		Draw.line(ctx, pm1.getPosition(), pm2.getPosition(), this.selected);
	}

	private applyStress(rigid_constraint: RigidConstraint, steps: number) {
		if (!this.stress.is_enable) return;
		// multiply with 1000 * steps to amplify the visual (+ 1/2 offset)
		let stress = rigid_constraint.getStress();
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
}

