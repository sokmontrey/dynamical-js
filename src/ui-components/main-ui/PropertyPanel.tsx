import { useEffect } from "react";
import PhysicBody from "../../core-physic/PhysicBody";

export default function PropertyPanel({ 
    body 
}: { body: PhysicBody }) {
    const binders = body.panel_property.getPropBinders();

    useEffect(() => {
        const unsubscribe = body.setOnUpdate(() => {
            binders.forEach(binder => binder.setValue(binder.getter()));
        });
        return () => unsubscribe();
    }, [body]);

    return <div key={body.getId()}>
        {binders.map((prop, index) => 
            <prop.component key={index} {...prop.props} />
        )}
    </div>;
}