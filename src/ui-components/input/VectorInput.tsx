import { useCallback } from "react";
import Vec2, { vec2 } from "../../utils/Vector";

export interface VectorInputProps {
    label: string;
    value: Vec2;
    onChange?: (value: Vec2) => void;
    enable?: boolean;
    step?: number;
}

export default function VectorInput({
    label,
    value,
    onChange,
    enable = true,
    step = 1
}: VectorInputProps) {
    const handle_x = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(vec2(Number(e.target.value), value.y));
    }, [onChange, value.y]);

    const handle_y = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(vec2(value.x, Number(e.target.value)));
    }, [onChange, value.x]);

    return <div className="flex flex-col">
        <p className="sec-txt-color mb-2">{label}</p>
        <div className="flex flex-row space-x-2">
            <label className='flex-1 sec-txt-color opacity-50'>x</label>
            <input 
                placeholder="x"
                className="w-full"
                disabled={!enable}
                type="number" 
                value={value.x} 
                onChange={handle_x}
                step={step}
            />
            <label className='flex-1 sec-txt-color opacity-50'>y</label>
            <input 
                placeholder="y"
                className="w-full"
                disabled={!enable}
                type="number" 
                value={value.y} 
                onChange={handle_y}
                step={step}
            />
        </div>
    </div>;
}