import { useEffect } from "react";
import Body from "../../core/Body.ts";
import RedButton from "../common/RedButton.tsx";
import BodyManager from "../../manager/BodyManager.ts";

interface PropertyPanelProps {
    body: Body<any, any>;
}

export default function PropertyPanel({ 
    body,
}: PropertyPanelProps) {
    const binders = body.getPropBinders();

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
            <RedButton
                desc="Delete this body"
                direction="right"
                onConfirmed={() => {
                    BodyManager.removeBody(body.getId()!);
                }} 
            >
                <i className="fa-solid fa-trash-can"></i> Delete
            </RedButton>
        </div>
    </div>;
}