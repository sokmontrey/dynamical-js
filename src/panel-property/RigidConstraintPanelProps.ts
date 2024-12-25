import RigidConstraint from "../core-physic/RigidConstraint";
import PhysicBodyPanelProps from "./PhysicBodyPanelProps";
import { PropBinder } from "../hooks/usePropBinder";

export default class RigidConstraintPanelProps implements PhysicBodyPanelProps {
    private rigid_constraint: RigidConstraint;

    constructor(rigid_constraint: RigidConstraint) {
        this.rigid_constraint = rigid_constraint;
    }

    getPropBinders(): PropBinder<any>[] {
        return [ ];
    }
}