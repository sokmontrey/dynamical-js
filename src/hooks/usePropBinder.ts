import React, { useCallback, useState } from "react";
import LoopManager from "../manager/LoopManager";

export interface PropBinder<T> {
    setValue: (value: T) => void;
    getter: () => T;
    component: React.FC<any>;
    props: any;
}

export function useInputPropBinder<T>(
    component: React.FC<any>,
    props: any,
    getter: () => T, 
    setter: (value: T) => void
): PropBinder<T> {
    const [value, setValue] = useState<T>(getter());

    const onChange = useCallback((value: T) => {
        setValue(value);
        setter(value);
        if (!LoopManager.isRunning()) LoopManager.render();
    }, [setter]);

    return {
        setValue,
        getter,
        component: component, 
        props: {
            ...props,
            value: value,
            onChange: onChange,
        },
    };
};