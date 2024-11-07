import Draw from "../canvas/Draw";
import { ArrowStyle, CircleStyle, LineStyle, SolidStyle, Style } from "../canvas/Style";
import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/math/Vector";
import Renderer from "./Renderer";

export default class PointMassRenderer implements Renderer {
	protected pointmass: PointMass;

	protected readonly current_position: Style
		& CircleStyle
		& SolidStyle
		& LineStyle = {
			is_enable: true,
			radius: 5,
			is_fill: true,
			fill_color: 'blue',
			is_stroke: false,
			stroke_color: 'lightgray',
			line_width: 3,
		};

	protected readonly velocity: Style
		& ArrowStyle
		& LineStyle
		& SolidStyle = {
			is_enable: true,
			head_size: 8,
			is_stroke: true,
			stroke_color: 'lightgray',
			line_width: 3,
			is_fill: true,
			fill_color: 'gray',
		};

	constructor(pointmass: PointMass) {
		this.pointmass = pointmass;
	}

	private drawCurrentPosition(ctx: CanvasRenderingContext2D, pos: Vec2) {
		if (!this.current_position.is_enable) return;
		Draw.circle(ctx, pos, this.current_position);
	}

	private drawVelocity(ctx: CanvasRenderingContext2D,
		pos: Vec2,
		vel: Vec2,
		steps: number,
	) {
		if (!this.velocity.is_enable) return;
		Draw.arrow(ctx, pos, vel.mul(steps * 5), this.velocity);
	}

	draw(ctx: CanvasRenderingContext2D, steps: number) {
		const pos = this.pointmass.getPosition();
		const vel = this.pointmass.getVelocity();
		this.drawCurrentPosition(ctx, pos);
		this.drawVelocity(ctx, pos, vel, steps);
		return this;
	}
}

