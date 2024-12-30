import { useEffect } from "react";
import Body from "../../core/Body.ts";

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

    return <div className="flex flex-col space-y-2 pr-2 pt-4">
        {binders.map((prop, index) => 
            <prop.component key={index} {...prop.props} />
        )}
    </div>;
}