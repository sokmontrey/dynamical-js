import PointMass from "../physic/PointMass";
import RigidConstraint from "../physic/RigidConstraint";
import { LineStyle, SolidStyle } from "./Style";

export interface PointMassRendererParams {
	radius?: number;
	// TODO: show prev position params...
}

export interface RigidConstraintRendererPrams {
	// TODO: difference visualization...
}

export class Renderer {
	draw(_: CanvasRenderingContext2D): Renderer { return this; }
}

export class PointMassRenderer extends Renderer {
	protected pointmass: PointMass;
	protected radius: number;

	public readonly current_position: SolidStyle;

	constructor(pointmass: PointMass, {
		radius = 5,
	}: PointMassRendererParams = {}) {
		super();
		this.pointmass = pointmass; 
		this.radius = radius;
		this.current_position = new SolidStyle({ is_stroke: false });
	}

	drawCurrentPosition(ctx: CanvasRenderingContext2D) {
		const pos = this.pointmass.getPosition();
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, this.radius, 0, 2 * Math.PI);
		this.current_position.applyStyleToContext(ctx);
		ctx.closePath();
	}

	draw(ctx: CanvasRenderingContext2D) {
		if(this.current_position.isEnable()) this.drawCurrentPosition(ctx);
		return this;
	}
}

export class RigidConstraintRenderer extends Renderer {
	protected rigid_constraint: RigidConstraint;

	public readonly constraint_line: LineStyle;

	constructor(rigid_constraint: RigidConstraint, {

	}: RigidConstraintRendererPrams = {}) {
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
		if(this.constraint_line.isEnable()) this.drawConstraintLine(ctx);
		return this;
	}
}
