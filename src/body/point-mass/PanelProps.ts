import BodyPanelProps from "../../core/BodyPanelProps";
import { PropBinder, useInputPropBinder } from "../../hooks/usePropBinder";
import LoopManager from "../../manager/LoopManager";
import BodyManager from "../../manager/BodyManager";
import BooleanInput from "../../ui-components/input/BooleanInput";
import NumberInput from "../../ui-components/input/NumberInput";
import VectorInput from "../../ui-components/input/VectorInput";
import Vec2 from "../../utils/Vector";
import PointMass from "./Body";

export default class PointMass_PanelProps implements BodyPanelProps {
    private point_mass: PointMass;

    constructor(point_mass: PointMass) {
        this.point_mass = point_mass;
    }

    getPropBinders(): PropBinder<any>[] {
        return [
            // static
            useInputPropBinder(BooleanInput, 
                { label: "Static" },
                () => this.point_mass.isStatic(),
                (value: boolean) => this.point_mass.setStatic(value)),

            // position
            useInputPropBinder(VectorInput, 
                { label: "Position", step: 10 },
                () => this.point_mass.getPosition(),
                (value: Vec2) => {
                    this.point_mass.setPosition(value);
                    if (!LoopManager.isRunning()) {
                        BodyManager.updateConnectedConstraints(this.point_mass);
                    }
                }),

            // velocity
            useInputPropBinder(VectorInput, 
                { label: "Velocity", step: 0.01 },
                () => this.point_mass.getVelocity(),
                (value: Vec2) => this.point_mass.setVelocity(value)),

            // constant acceleration
            useInputPropBinder(VectorInput, 
                { label: "Acceleration", step: 0.1 },
                () => this.point_mass.getConstantAcceleration(),
                (value: Vec2) => this.point_mass.setConstantAcceleration(value)),

            // net force (apply when user press a button)
            // useInputPropBinder(VectorInput, 
            //     { label: "Net Force", step: 1 },
            //     () => this.point_mass.getNetForce(),
            //     (value: Vec2) => this.point_mass.applyForce(value)),

            // mass
            useInputPropBinder(NumberInput, 
                { label: "Mass", min: 0.01, step: 1 },
                () => this.point_mass.getMass(),
                (value: number) => this.point_mass.setMass(value)),
        ];
    }
}