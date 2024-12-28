import { useInputPropBinder, PropBinder } from "../hooks/usePropBinder";
import PhysicBodyPanelProps from "./PhysicBodyPanelProps";
import CircularKinematic from "../core-physic/CircularKinematic";
import BooleanInput from "../ui-components/input/BooleanInput";
import VectorInput from "../ui-components/input/VectorInput";
import Vec2 from "../utils/Vector";
import NumberInput from "../ui-components/input/NumberInput";

export default class CircularKinematicPanelProps implements PhysicBodyPanelProps {
    private circular_kinematic: CircularKinematic;

    constructor(circular_kinematic: CircularKinematic) {
        this.circular_kinematic = circular_kinematic;
    }

    getPropBinders(): PropBinder<any>[] {
        return [
            // is running
            useInputPropBinder(BooleanInput, 
                { label: "Running" },
                () => this.circular_kinematic.isRunning(),
                (value: boolean) => this.circular_kinematic.setRunning(value)),

            // position
            useInputPropBinder(VectorInput, 
                { label: "Position", step: 10 },
                () => this.circular_kinematic.getPosition(),
                (value: Vec2) => this.circular_kinematic.setPosition(value)),

            // radius
            useInputPropBinder(NumberInput, 
                { label: "Radius", step: 10, min: 0.01 },
                () => this.circular_kinematic.getRadius(),
                (value: number) => this.circular_kinematic.setRadius(value)),

            // angle velocity
            useInputPropBinder(NumberInput, 
                { label: "Angular Velocity", step: 10 },
                () => this.circular_kinematic.getAngularVelocity(false),
                (value: number) => 
                    this.circular_kinematic.setAngularVelocity(value, false)),

            // angle
            useInputPropBinder(NumberInput, 
                { label: "Angle", step: 10, min: 0, max: 360 },
                () => this.circular_kinematic.getAngle(false),
                (value: number) => 
                    this.circular_kinematic.setAngle(value, false)),
        ];
    }
}