import { useCallback, useState } from "react";
import Vec2, { vec2 } from "../../utils/Vector";
import LoopManager from "../../manager/LoopManager";

export interface VectorInputProps {
    label: string;
    value: Vec2;
    onChange?: (value: Vec2) => void;
    enable?: boolean;
}

export default function VectorInput({
    label,
    value,
    onChange,
    enable = true
}: VectorInputProps) {
    const handle_x = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(vec2(Number(e.target.value), value.y));
    }, [onChange, value.y]);

    const handle_y = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(vec2(value.x, Number(e.target.value)));
    }, [onChange, value.x]);

    return <div>
        <p>{label}</p>
        <label>X:
            <input 
                disabled={!enable}
                type="number" 
                value={value.x} 
                onChange={handle_x} />
        </label>
        <label>Y:
            <input 
                disabled={!enable}
                type="number" 
                value={value.y} 
                onChange={handle_y} />
        </label>
    </div>;
}