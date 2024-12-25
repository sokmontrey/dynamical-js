import { useEffect } from "react";
import PhysicBody from "../../core-physic/PhysicBody";
import Vec2 from "../../utils/Vector";
import PointMass from "../../core-physic/PointMass";
import LoopManager from "../../manager/LoopManager";
import PhysicBodyManager from "../../manager/PhysicBodyManager";
import createInput from "../input/createInput";
import VectorInput from "../input/VectorInput";

export default function PointMassPanel({ 
    body 
}: { body: PhysicBody }) {
    const pm = body as PointMass;

    const props = [
        createInput(VectorInput,
            { label: "Position" },
            pm.getPosition.bind(pm),
            (value: Vec2) => {
                pm.setPosition(value);
                if (!LoopManager.isRunning()) {
                    PhysicBodyManager.updateConnectedConstraints(pm);
                }
            },
        ),
    ];

    useEffect(() => {
        const unsubscribe = body.setOnUpdate(() => {
            props.forEach(prop => prop.setValue(prop.getter()));
        });
        return () => unsubscribe();
    }, [body]);

    return <div className='point-mass-panel'>
        {props.map(prop => prop.component)}
    </div>;
}