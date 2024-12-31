export interface BooleanInputProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    enable?: boolean;
}

export default function BooleanInput({
    label,
    value,
    onChange,
    enable = true
}: BooleanInputProps) {
    return <div className="flex flex-row space-x-2 pt-2">
        <label className="sec-txt-color">{label}</label> 
        <input 
            title={label}
            type="checkbox" 
            checked={value} 
            onChange={(e) => onChange(e.target.checked)} 
            disabled={!enable} 
        />
    </div>;
}
