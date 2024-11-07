import PointMass from "../core-physic/PointMass";
import Renderer from "./Renderer";

export default class PointMassRenderer extends Renderer {
    protected pointmass: PointMass;

    constructor(pointmass: PointMass) {
        super();
        this.pointmass = pointmass;
    }

    draw(ctx: CanvasRenderingContext2D, steps: number) {
        return this;
    }
}

