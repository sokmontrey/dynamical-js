import RigidConstraint from "../core-physic/RigidConstraint";
import Vec2 from "../utils/math/Vector";
import Interactor from "./Interactor";

export default class RigidConstraintInteractor extends Interactor {
	protected rigid_constraint: RigidConstraint;

	constructor(rigid_constraint: RigidConstraint) {
		super();
		this.rigid_constraint = rigid_constraint;
	}

    isBoundingBoxContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }

    isContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }
}
