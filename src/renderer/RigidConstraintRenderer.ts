import Draw from "../core/Draw";
import RigidConstraint from "../core-physic/RigidConstraint";
import LineStyle from "../style/LineStyle";
import StressStyle from "../style/StressStyle";
import Color from "../utils/color/Color";
import Vec2 from "../utils/math/Vector";
import IRenderer from "./IRenderer";

export default class RigidConstraintRenderer implements IRenderer {
	protected rigid_constraint: RigidConstraint;

	public readonly constraint_line;
	public readonly stress;

	constructor(rigid_constraint: RigidConstraint) {
		this.rigid_constraint = rigid_constraint;

		this.constraint_line = new LineStyle();
		this.stress = new StressStyle().disable();
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
}

