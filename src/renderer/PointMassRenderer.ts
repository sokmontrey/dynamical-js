import Draw from "../core/Draw";
import PointMass from "../core-physic/PointMass";
import ArrowStyle from "../style/ArrowStyle";
import CircleStyle from "../style/CircleStyle";
import Vec2 from "../utils/math/Vector";
import Renderer from "./Renderer";

export default class PointMassRenderer extends Renderer {
	protected pointmass: PointMass;

	public readonly position;
	public readonly velocity;

	constructor(pointmass: PointMass) {
		super();
		this.pointmass = pointmass;

		this.position = new CircleStyle().noStroke();
		this.velocity = new ArrowStyle().setFillColor('gray').disable();
	}

	private drawCurrentPosition(ctx: CanvasRenderingContext2D, pos: Vec2) {
		if (!this.position.isEnable()) return;
		Draw.circle(ctx, pos, this.position);
	}

	private drawVelocity(ctx: CanvasRenderingContext2D, pos: Vec2, vel: Vec2, steps: number) {
		if (!this.velocity.isEnable()) return;
		Draw.arrow(ctx, pos, vel.mul(steps * 5), this.velocity);
	}

	public draw(ctx: CanvasRenderingContext2D, steps: number) {
		const pos = this.pointmass.getPosition();
		const vel = this.pointmass.getVelocity();
		this.drawCurrentPosition(ctx, pos);
		this.drawVelocity(ctx, pos, vel, steps);
		return this;
	}

	override getBoundingBox(): [Vec2, Vec2] {
		throw new Error("Method not implemented.");
	}
}

