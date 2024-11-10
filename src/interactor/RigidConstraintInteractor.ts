import RigidConstraint from "../core-physic/RigidConstraint";
import Vec2 from "../utils/math/Vector";
import Interactor from "./Interactor";

export default class RigidConstraintInteractor implements Interactor {
	protected rigid_constraint: RigidConstraint;

    isBoundingBoxContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }

    isContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }
}
