import BodyPanelProps from "../../core/BodyPanelProps";
import { PropBinder, useInputPropBinder } from "../../hooks/usePropBinder";
import BooleanInput from "../../ui-components/input/BooleanInput";
import NumberInput from "../../ui-components/input/NumberInput";
import RigidConstraint from "./Body";

export default class RigidConstraint_PanelProps implements BodyPanelProps {
    private rigid_constraint: RigidConstraint;

    constructor(rigid_constraint: RigidConstraint) {
        this.rigid_constraint = rigid_constraint;
    }

    getPropBinders(): PropBinder<any>[] {
        return [ 
            useInputPropBinder(BooleanInput,
                { label: "Connected" },
                () => !this.rigid_constraint.isBroken(),
                (value: boolean) => value ? 
                    this.rigid_constraint.restore(true) : 
                    this.rigid_constraint.break()),

            useInputPropBinder(NumberInput,
                { label: "Rest Distance", enable: true },
                () => this.rigid_constraint.getRestDistance(),
                (value: number) => this.rigid_constraint.setRestDistance(value)),

            useInputPropBinder(NumberInput,
                { label: "Current Distance", enable: false },
                () => this.rigid_constraint.getCurrentDistance(),
                (_value: number) => {}),
        ];
    }
}