import BodyManager from "@/manager/BodyManager";
import { useEffect } from "react";
import RedButton from "../common/RedButton";
import Tooltip from "../common/Tooltip";
import Body, { BodyType } from "@/core/Body";
import { PropBinder } from "@/hooks/usePropBinder";
import useCircularKinematic_PropBinders from "@/body/circular-kinematic/PanelProps";
import usePointMass_PropBinders from "@/body/point-mass/PanelProps";
import useRigidConstraint_PropBinders from "@/body/rigid-constraint/PanelProps";

interface PropertyPanelProps {
    body: Body<any, any>;
}

export default function PropertyPanel({ 
    body,
}: PropertyPanelProps) {
    const binders_map = {
        [BodyType.POINT_MASS]: usePointMass_PropBinders,
        [BodyType.RIGID_CONSTRAINT]: useRigidConstraint_PropBinders,
        [BodyType.CIRCULAR_KINEMATIC]: useCircularKinematic_PropBinders,
    }

    const binders = binders_map[body.getType()]!(body);

    useEffect(() => {
        const unsubscribe = body.setOnUpdate(() => {
            binders.forEach(binder => binder.setValue(binder.getter()));
        });
        return () => unsubscribe();
    }, [body]);

    return <div className="flex flex-col space-y-2 pr-2 pt-2">
        <p className="acc-color font-bold text-lg">{body.getId()}</p>
        {binders.map((prop, index) => 
            <prop.component key={index} {...prop.props} />
        )}
        <div className="pt-4">
            <Tooltip text="Delete this body" direction="right">
                <RedButton
                    onConfirmed={() => {
                        BodyManager.removeBody(body.getId()!);
                    }} 
                >
                    <i className="fa-solid fa-trash-can"></i> Delete
                </RedButton>
            </Tooltip>
        </div>
    </div>;
}