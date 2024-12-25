import { useEffect, useState } from "react";
import PhysicBody from "../../core-physic/PhysicBody";
import VectorInput from "../input/VectorInput";
import PointMass from "../../core-physic/PointMass";
import Vec2 from "../../utils/Vector";

export default function PointMassPanel({ 
    body 
}: { body: PhysicBody }) {
    const [position, setPosition] = useState(body.getPosition());

    useEffect(() => {
        const unsubscribe = body.setOnUpdate(() => {
            setPosition(body.getPosition());
        });
        return () => unsubscribe();
    }, [body]);

    return <div className='point-mass-panel'>
        <VectorInput label="Position" 
            value={position} 
            onChange={(value: Vec2) => {
                setPosition(value);
                (body as PointMass).setPosition(value);
            }} />
    </div>;
}