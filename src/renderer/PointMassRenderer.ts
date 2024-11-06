import PointMass from "../core-physic/PointMass";
import Renderer from "./Renderer";
import ArrowShape from "../shape/ArrowShape";
import CircleShape from "../shape/CircleShape";

export default class PointMassRenderer extends Renderer {
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

