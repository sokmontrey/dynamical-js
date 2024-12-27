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
    return <div>
        <p>{label}</p>
        <input 
            title={label}
            type="checkbox" 
            checked={value} 
            onChange={(e) => onChange(e.target.checked)} 
            disabled={!enable} 
        />
    </div>;
}
