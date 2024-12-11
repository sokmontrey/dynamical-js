import { useState } from "react";

export interface SelectButtonProps<T> {
    options: T[];
    onSelect: (option: T) => void;
}

export default function SelectButton<T>({ options, onSelect }: SelectButtonProps<T>) {
    const [selectedOption, setSelectedOption] = useState<T>(options[0]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleButtonClick = () => {
        onSelect(selectedOption);
    };

    const handleDropdownToggle = (e: Event) => {
        e.stopPropagation(); // Prevent the button click from firing
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
                {selectedOption?.toString()}
            </button>
            <button onClick={handleDropdownToggle}> v </button>
            {showDropdown && <div>
                {options.map((option, i: number) =>
                    <div key={i} onClick={() => handleOptionSelect(option)}
                         style={{ // TODO: use css for this
                         padding: "8px 16px",
                         cursor: "pointer",
                         backgroundColor: option === selectedOption ? "#f0f0f0" : "white"
                     }} > {option?.toString()} </div>
                )}
            </div>}
        </div>
    );
};