import RigidConstraint from "../core-physic/RigidConstraint";
import Renderer from "./Renderer";

export default class RigidConstraintRenderer extends Renderer {
    protected rigid_constraint: RigidConstraint;

    constructor(rigid_constraint: RigidConstraint) {
        super();
        this.rigid_constraint = rigid_constraint;
    }

    draw(ctx: CanvasRenderingContext2D, steps: number) {
        return this;
    }
}

