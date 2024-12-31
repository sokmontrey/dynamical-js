export interface NumberInputProps {
    label: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    enable?: boolean;
    className?: string;
}

export default function NumberInput({
    label,
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    enable = true,
    className = "",
}: NumberInputProps) {
    return <div className={`flex flex-row space-x-2 w-full ${className}`}>
        <label className="sec-txt-color">{label}</label> 
        <input 
            className="flex-1"
            placeholder={label}
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))} 
            min={min}
            max={max}
            step={step}
            disabled={!enable}
        />
    </div>
}