import { useState, useEffect } from "react";

export interface SelectButtonProps<T> {
    options: T[];
    onSelect: (option: T) => void;
}

export default function SelectButton<T>({ options, onSelect }: SelectButtonProps<T>) {
    const [selectedOption, setSelectedOption] = useState<T | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (options.length > 0 && selectedOption === null) {
            setSelectedOption(options[0]);
            onSelect(options[0]);
        }
    }, [options, selectedOption, onSelect]);

    const handleButtonClick = () => {
        if (selectedOption !== null) {
            onSelect(selectedOption);
        }
    };

    const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowDropdown(prev => !prev);
    };

    const handleOptionSelect = (option: T) => {
        setSelectedOption(option);
        setShowDropdown(false);
        onSelect(option);
    };

    return (
        <div>
            <button onClick={handleButtonClick}>
                {selectedOption?.toString() ?? 'Select...'}
            </button>
            <button onClick={handleDropdownToggle}> v </button>
            {showDropdown && <div>
                {options.map((option, i: number) =>
                    <div key={i} onClick={() => handleOptionSelect(option)}
                         style={{
                         padding: "8px 16px",
                         cursor: "pointer",
                         backgroundColor: option === selectedOption ? "#f0f0f0" : "white"
                     }} > {option?.toString()} </div>
                )}
            </div>}
        </div>
    );
};