import PointMass from "../physic/PointMass";
import RigidConstraint from "../physic/RigidConstraint";
import { ArrowShape, CircleShape, LineShape } from "./Style";

export class Renderer {
	draw(_: CanvasRenderingContext2D): Renderer { return this; }
}

export class PointMassRenderer extends Renderer {
	protected pointmass: PointMass;

	public readonly position: CircleShape;
	public readonly velocity: ArrowShape;

	constructor(pointmass: PointMass) {
		super();
		this.pointmass = pointmass;
		this.position = new CircleShape({ is_stroke: false });
		this.velocity = new ArrowShape().disable();
	}

	draw(ctx: CanvasRenderingContext2D) {
		const pos = this.pointmass.getPosition();
		const vel = this.pointmass.getVelocity();
		this.position.draw(ctx, pos);
		this.velocity.draw(ctx, pos, vel);
		return this;
	}
}

export class RigidConstraintRenderer extends Renderer {
	protected rigid_constraint: RigidConstraint;

	public readonly constraint_line: LineShape;

	constructor(rigid_constraint: RigidConstraint) {
		super();
		this.rigid_constraint = rigid_constraint;
		this.constraint_line = new LineShape();
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.constraint_line.draw(ctx,
			this.rigid_constraint
				.getPointMass(false)
				.getPosition(),
			this.rigid_constraint
				.getPointMass(true)
				.getPosition());
		return this;
	}
}
