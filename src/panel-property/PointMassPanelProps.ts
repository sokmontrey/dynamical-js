import Vec2 from "../utils/Vector";
import PointMass from "../core-physic/PointMass";
import LoopManager from "../manager/LoopManager";
import PhysicBodyManager from "../manager/PhysicBodyManager";
import VectorInput from "../ui-components/input/VectorInput";
import { useInputPropBinder, PropBinder } from "../hooks/usePropBinder";
import PhysicBodyPanelProps from "./PhysicBodyPanelProps";

export default class PointMassPanelProps implements PhysicBodyPanelProps {
    private point_mass: PointMass;

    constructor(point_mass: PointMass) {
        this.point_mass = point_mass;
    }

    getPropBinders(): PropBinder<any>[] {
        return [
            useInputPropBinder(VectorInput, { label: "Position" },
                () => this.point_mass.getPosition(),
                (value: Vec2) => {
                    this.point_mass.setPosition(value);
                    if (!LoopManager.isRunning()) {
                        PhysicBodyManager.updateConnectedConstraints(this.point_mass);
                    }
                }),

            useInputPropBinder(VectorInput, { label: "Velocity" },
                () => this.point_mass.getVelocity(),
                (value: Vec2) => this.point_mass.setVelocity(value)
            ),
        ];
    }
}