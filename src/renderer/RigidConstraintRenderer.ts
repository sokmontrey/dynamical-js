import RigidConstraint from "../core-physic/RigidConstraint";
import Renderer from "./Renderer";
import LineShape from "../shape/LineShape";
import Shape from "../shape/Shape";
import Color, { color } from "../utils/color/Color";

export default class RigidConstraintRenderer extends Renderer {
    protected rigid_constraint: RigidConstraint;

	public readonly stress: Shape;
    public readonly constraint_line: LineShape;

    constructor(rigid_constraint: RigidConstraint) {
        super();
        this.rigid_constraint = rigid_constraint;
        this.constraint_line = new LineShape();
		this.stress = new Shape().disable();
    }

	// TODO: customizable stress visualization
	checkStress(steps: number) {
		if (!this.stress.isEnable()) return;
		let stress = this.rigid_constraint.getStress();
		stress *= 1e3 * steps;
		stress += 0.5;
		const a = color(10, 100, 255);
		const b = color(255, 100, 10);
		const c = Color.lerp(a, b, stress);
		this.constraint_line.setStrokeColor(c.toString());
	}

    draw(ctx: CanvasRenderingContext2D, steps: number) {
		this.checkStress(steps);
        this.constraint_line.draw(ctx,
            this.rigid_constraint
                .getPointMass(false)
                .getPosition(),
            this.rigid_constraint
                .getPointMass(true)
                .getPosition(),
			steps);
        return this;
    }
}

