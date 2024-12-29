import BodyRenderer from "../../core/BodyRenderer";
import Draw from "../../core/Draw";
import ArrowStyle, { ArrowStyleProps } from "../../style/ArrowStyle";
import CircleStyle, { CircleStyleProps } from "../../style/CircleStyle";
import Vec2 from "../../utils/Vector";
import PointMass from "./Body";

export interface PointMass_RendererProps {
	position?: CircleStyleProps;
	static_position?: CircleStyleProps;
	velocity?: ArrowStyleProps;
	selected?: CircleStyleProps;
}

export default class PointMass_Renderer extends BodyRenderer<PointMass> {
	position: CircleStyle;
	static_position: CircleStyle;
	velocity: ArrowStyle;
	selected: CircleStyle;

	constructor(props: PointMass_RendererProps) {
		super();
		this.position = new CircleStyle(props.position);
		this.static_position = new CircleStyle(props.static_position);
		this.velocity = new ArrowStyle(props.velocity);
		this.selected = new CircleStyle(props.selected);
	}

	private drawCurrentPosition(pointmass: PointMass, ctx: CanvasRenderingContext2D, pos: Vec2) {
		if (!this.position.is_enable) return;
		if (pointmass.isStatic()) Draw.circle(ctx, pos, this.static_position);
		else Draw.circle(ctx, pos, this.position);
	}

	private drawVelocity(ctx: CanvasRenderingContext2D, pos: Vec2, vel: Vec2, steps: number) {
		if (!this.velocity.is_enable) return;
		Draw.arrow(ctx, pos, vel.mul(steps * 5), this.velocity);
	}

	draw(pointmass: PointMass, ctx: CanvasRenderingContext2D, steps: number) {
		const pos = pointmass.getPosition();
		const vel = pointmass.getVelocity();
		this.drawCurrentPosition(pointmass, ctx, pos);
		this.drawVelocity(ctx, pos, vel, steps);
	}

	drawSelection(pointmass: PointMass, ctx: CanvasRenderingContext2D) {
		Draw.circle(ctx, pointmass.getPosition(), this.selected);
	}
}