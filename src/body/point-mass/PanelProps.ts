import { PropBinder, useInputPropBinder } from "@/hooks/usePropBinder";
import BooleanInput from "@/components/input/BooleanInput";
import NumberInput from "@/components/input/NumberInput";
import VectorInput from "@/components/input/VectorInput";
import Vec2 from "@/utils/Vector";
import PointMass, { PointMass_Props } from "./Body";
import BodyManager from "@/manager/BodyManager";
import LoopManager from "@/manager/LoopManager";
import Body, { BodyType } from "@/core/Body";

export default function usePointMass_PropBinders(
    body: Body<PointMass, PointMass_Props>
): PropBinder<any>[] {
    const point_mass = body as PointMass;
    return [
        // static
        useInputPropBinder(BooleanInput, 
            { label: "Static" },
            () => point_mass.isStatic(),
            (value: boolean) => point_mass.setStatic(value)),

        // mass
        useInputPropBinder(NumberInput, 
            { label: "Mass", min: 0.01, step: 1 },
            () => point_mass.getMass(),
            (value: number) => point_mass.setMass(value)),

        // position
        useInputPropBinder(VectorInput, 
            { label: "Position", step: 10 },
            () => point_mass.getPosition(),
            (value: Vec2) => {
                point_mass.setPosition(value);
                if (!LoopManager.isRunning()) {
                    BodyManager.updateConnectedConstraints(point_mass);
                }
            }),

        // velocity
        useInputPropBinder(VectorInput, 
            { label: "Velocity", step: 0.001 },
            () => point_mass.getVelocity(),
            (value: Vec2) => point_mass.setVelocity(value)),

        // constant acceleration
        useInputPropBinder(VectorInput, 
            { label: "Acceleration", step: 0.1 },
            () => point_mass.getConstantAcceleration(),
            (value: Vec2) => point_mass.setConstantAcceleration(value)),
    ];
}