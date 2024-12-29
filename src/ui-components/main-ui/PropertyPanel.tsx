import { useEffect } from "react";
import Body from "../../core/Body.ts";

export default function PropertyPanel({ 
    body 
}: { body: Body<any, any> }) {
    const binders = body.getPropBinders();

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