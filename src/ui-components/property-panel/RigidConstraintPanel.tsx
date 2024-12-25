import { useEffect, useState } from "react";
import RigidConstraint from "../../core-physic/RigidConstraint";
import Vec2 from "../../utils/Vector";

export default function PointMassPanel({ 
    rigid_constraint 
}: { rigid_constraint: RigidConstraint }) {
    // const [position, setPosition] = useState(rigid_constraint.getPosition());

    // useEffect(() => {
    //     const unsubscribe = rigid_constraint.setOnUpdate(() => {
    //         setPosition(rigid_constraint.getPosition());
    //     });
    //     return () => unsubscribe();
    // }, [rigid_constraint]);

    return <div>
        {/* <p>Position</p>
        <label>X:
            <input 
                type="number" 
                value={position.x} 
                onChange={(e) => setPosition(new Vec2(Number(e.target.value), position.y))} />
        </label>
        <label>Y:
            <input 
                type="number" 
                value={position.y} 
                onChange={(e) => setPosition(new Vec2(position.x, Number(e.target.value)))} />
        </label> */}
    </div>;
}