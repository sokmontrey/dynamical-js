import PointMass from "../physic/PointMass";
import RigidConstraint from "../physic/RigidConstraint";
import { CircleStyle, LineStyle, SolidStyle } from "./Style";

export class Renderer {
	draw(_: CanvasRenderingContext2D): Renderer { return this; }
}

export class PointMassRenderer extends Renderer {
	protected pointmass: PointMass;

	public readonly position: CircleStyle;

	constructor(pointmass: PointMass) {
		super();
		this.pointmass = pointmass;
		this.position = new CircleStyle({ is_stroke: false });
	}

	drawCurrentPosition(ctx: CanvasRenderingContext2D) {
		const pos = this.pointmass.getPosition();
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, this.position.getRadius(), 0, 2 * Math.PI);
		this.position.applyStyleToContext(ctx);
		ctx.closePath();
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.position.isEnable()) this.drawCurrentPosition(ctx);
		return this;
	}
}

export class RigidConstraintRenderer extends Renderer {
	protected rigid_constraint: RigidConstraint;

	public readonly constraint_line: LineStyle;

	constructor(rigid_constraint: RigidConstraint) {
		super();
		this.rigid_constraint = rigid_constraint;
		this.constraint_line = new LineStyle();
	}

	drawConstraintLine(ctx: CanvasRenderingContext2D) {
		const pos1 = this.rigid_constraint.getPointMass(false).getPosition();
		const pos2 = this.rigid_constraint.getPointMass(true).getPosition();
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x, pos2.y);
		this.constraint_line.applyStyleToContext(ctx);
		ctx.closePath();
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.constraint_line.isEnable()) this.drawConstraintLine(ctx);
		return this;
	}
}
