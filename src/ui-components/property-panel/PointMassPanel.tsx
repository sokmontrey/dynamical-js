import { useEffect, useState } from "react";
import PointMass from "../../core-physic/PointMass";
import PhysicBody from "../../core-physic/PhysicBody";
import VectorInput from "../input/VectorInput";

export default function PointMassPanel({ 
    body 
}: { body: PhysicBody }) {
    const point_mass = body as PointMass;

    const [position, setPosition] = useState(point_mass.getPosition());
    const [velocity, setVelocity] = useState(point_mass.getVelocity());

    useEffect(() => {
        const unsubscribe = point_mass.setOnUpdate(() => {
            setPosition(point_mass.getPosition());
            setVelocity(point_mass.getVelocity());
        });
        return () => unsubscribe();
    }, [point_mass]);

    return <div>
        <p>Position</p>
        <VectorInput value={position} onChange={setPosition}/>
        <p>Velocity</p>
        <VectorInput value={velocity} enable={false}/>
    </div>;
}