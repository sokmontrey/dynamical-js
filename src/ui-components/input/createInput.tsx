import React, { useCallback, useState } from "react";
import LoopManager from "../../manager/LoopManager";

export default function createInput<T>(
    component: React.FC<any>,
    props: any, // TODO: fix this
    getter: () => T, 
    setter: (value: T) => void
) {
    const [value, setValue] = useState<T>(getter());

    const onChange = useCallback((value: T) => {
        setValue(value);
        setter(value);
        if (!LoopManager.isRunning()) LoopManager.render();
    }, [setter]);

    return {
        setValue,
        getter,
        component: React.createElement(component, {
            ...props,
            value: value,
            onChange: onChange,
        }),
    };
};