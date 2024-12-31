import { PropBinder, useInputPropBinder } from "@/hooks/usePropBinder";
import BooleanInput from "@/components/input/BooleanInput";
import NumberInput from "@/components/input/NumberInput";
import RigidConstraint, { RigidConstraint_Props } from "./Body";
import Body, { BodyType } from "@/core/Body";

export default function useRigidConstraint_PropBinders(
    body: Body<RigidConstraint, RigidConstraint_Props>
): PropBinder<any>[] {       
    const rigid_constraint = body as RigidConstraint;
    return [ 
        useInputPropBinder(BooleanInput,
            { label: "Connected" },
            () => !rigid_constraint.isBroken(),
            (value: boolean) => value ? 
                rigid_constraint.restore(true) : 
                rigid_constraint.break()),

        useInputPropBinder(NumberInput,
            { label: "Rest Distance", enable: true },
            () => rigid_constraint.getRestDistance(),
            (value: number) => rigid_constraint.setRestDistance(value)),

        useInputPropBinder(NumberInput,
            { label: "Current Distance", enable: false },
            () => rigid_constraint.getCurrentDistance(),
            (_value: number) => {}),
    ];
}