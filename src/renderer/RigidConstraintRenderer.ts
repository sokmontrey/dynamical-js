import RigidConstraint from "../physic/RigidConstraint";
import Renderer from "./Renderer";
import LineShape from "../shape/LineShape";

export default class RigidConstraintRenderer extends Renderer {
    protected rigid_constraint: RigidConstraint;

    public readonly constraint_line: LineShape;

    constructor(rigid_constraint: RigidConstraint) {
        super();
        this.rigid_constraint = rigid_constraint;
        this.constraint_line = new LineShape();
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.constraint_line.draw(ctx,
            this.rigid_constraint
                .getPointMass(false)
                .getPosition(),
            this.rigid_constraint
                .getPointMass(true)
                .getPosition());
        return this;
    }
}

