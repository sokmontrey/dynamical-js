import Draw from "../core/Draw";
import PointMass from "../core-physic/PointMass";
import ArrowStyle from "../style/ArrowStyle";
import CircleStyle from "../style/CircleStyle";
import Vec2 from "../utils/Vector.ts";
import IRenderer from "./IRenderer.ts";

export default class PointMassRenderer implements IRenderer {
	protected pointmass: PointMass;

	public readonly position;
	public readonly velocity;

	constructor(pointmass: PointMass) {
		this.pointmass = pointmass;

		this.position = new CircleStyle()
			.setRadius(this.pointmass.getMass() * 10)
			.noStroke();
		this.velocity = new ArrowStyle()
			.setFillColor('gray')
			.disable();
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

	drawBoundingBox(ctx: CanvasRenderingContext2D): IRenderer {
		return this;
	}
}

