import Vec2, { vec2 } from "../../utils/Vector";

export interface VectorInputProps {
    value: Vec2;
    onChange?: (value: Vec2) => void;
    enable?: boolean;
}

export default function VectorInput({
    value,
    onChange,
    enable = true
}: VectorInputProps) {
    return <div>
        <label>X:
            <input 
                disabled={!enable}
                type="number" 
                value={value.x} 
                onChange={(e) => {
                    onChange?.(vec2(Number(e.target.value), value.y));
                }} />
        </label>
        <label>Y:
            <input 
                disabled={!enable}
                type="number" 
                value={value.y} 
                onChange={(e) => {
                    onChange?.(vec2(value.x, Number(e.target.value)));
                }} />
        </label>
    </div>;
}