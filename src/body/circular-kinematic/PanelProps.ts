import { useInputPropBinder } from "@/hooks/usePropBinder";
import Body, { BodyType } from "@/core/Body";
import { PropBinder } from "@/hooks/usePropBinder";
import CircularKinematic, { CircularKinematic_Props } from "./Body";
import BooleanInput from "@/components/input/BooleanInput";
import VectorInput from "@/components/input/VectorInput";
import Vec2 from "@/utils/Vector";
import NumberInput from "@/components/input/NumberInput";

export default function useCircularKinematic_PropBinders(
    body: Body<CircularKinematic, CircularKinematic_Props>
): PropBinder<any>[] {
    const circular_kinematic = body as CircularKinematic;
    return [
        // is running
        useInputPropBinder(BooleanInput, 
            { label: "Running" },
            () => circular_kinematic.isRunning(),
            (value: boolean) => circular_kinematic.setRunning(value)),

            // position
        useInputPropBinder(VectorInput, 
            { label: "Position", step: 10 },
            () => circular_kinematic.getPosition(),
            (value: Vec2) => circular_kinematic.setPosition(value)),

            // radius
        useInputPropBinder(NumberInput, 
            { label: "Radius", step: 10, min: 0.01 },
            () => circular_kinematic.getRadius(),
            (value: number) => circular_kinematic.setRadius(value)),

            // angle velocity
        useInputPropBinder(NumberInput, 
            { label: "Angular Velocity", step: 10 },
            () => circular_kinematic.getAngularVelocity(false),
            (value: number) => 
                circular_kinematic.setAngularVelocity(value, false)),

            // angle
        useInputPropBinder(NumberInput, 
            { label: "Angle", step: 10, min: 0, max: 360 },
            () => circular_kinematic.getAngle(false),
            (value: number) => 
                circular_kinematic.setAngle(value, false)),
    ];
}