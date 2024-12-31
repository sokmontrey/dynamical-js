import BodyRenderer from "@/core/BodyRenderer";
import Draw from "@/core/Draw";
import ArrowStyle, { ArrowStyleProps } from "@/style/ArrowStyle";
import CircleStyle, { CircleStyleProps } from "@/style/CircleStyle";
import Color from "@/utils/Color";
import Vec2 from "@/utils/Vector";
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
		this.position = new CircleStyle(props.position || {
			line_width: 2,
			fill_color: Color.acc,
			stroke_color: Color.acc,
			radius: 6,
		});
		this.static_position = new CircleStyle(props.static_position || {
			// line_width: 2,
			is_stroke: false,
			// stroke_color: Color.sec_txt,
			fill_color: Color.sec_txt,
			radius: 6,
		});
		this.selected = new CircleStyle(props.selected || {
			line_width: 2,
			stroke_color: Color.sel,
			fill_color: Color.sel_light,
			radius: 7,
		});
		this.velocity = new ArrowStyle(props.velocity || {
			line_width: 2,
			stroke_color: Color.sec,
			fill_color: Color.sec,
		});
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