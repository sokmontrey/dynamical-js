import { useState, useEffect, useRef } from "react";
import IconButton from "../common/IconButton";

export interface SelectOption<T> {
    type: T;
    desc: string;
    icon_class: string;
}

export interface SelectButtonProps<T> {
    options: SelectOption<T>[];
    onSelect: (option: T) => void;
    focused: boolean;
}

export default function SelectButton<T>({ 
    options, 
    onSelect, 
    focused 
}: SelectButtonProps<T>) {
    const [selected_option, setSelectedOption] = useState<SelectOption<T> | null>(null);
    const [is_show_dropdown, setShowDropdown] = useState(false);
    const dropdown_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (options.length > 0 && selected_option === null) {
            setSelectedOption(options[0]);
            onSelect(options[0].type);
        }
    }, [options, selected_option, onSelect]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleButtonClick = () => {
        if (selected_option !== null) {
            onSelect(selected_option.type);
        }
    };

    const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowDropdown(prev => !prev);
    };

    const handleOptionSelect = (option: SelectOption<T>) => {
        setSelectedOption(option);
        setShowDropdown(false);
        onSelect(option.type);
    };

    return (
        <div className="flex-col relative inline-block" ref={dropdown_ref}>
            <div className="flex items-center">
                <IconButton 
                    focused={focused}
                    desc={selected_option?.desc ?? "Create"} 
                    icon_class={selected_option?.icon_class ?? "fa-solid fa-plus"}
                    onClick={handleButtonClick} 
                    direction="bottom" />

                <button 
                    aria-label="Select"
                    onClick={handleDropdownToggle}
                    className="h-9 font-mono pl-1 rounded-lg txt-color opacity-50 hover:opacity-100 text-sm">
                    <i className="fa-solid fa-chevron-down"></i>
                </button>
            </div>

            {is_show_dropdown && <div className="flex flex-col space-y-2 absolute left-0 mt-2 prm-bg rounded-lg w-[200px] z-50 shadow-lg">
                {options.map((option, i: number) =>
                    <button
                        key={i} 
                        onClick={() => handleOptionSelect(option)}
                        className={`cursor-pointer hover:text-[var(--prm-color)] hover:bg-[var(--acc-color)] text-left px-4 py-1 transition-all duration-100 first:rounded-t-lg last:rounded-b-lg first:pt-2 last:pb-2`}
                    > 
                        <i className={`${option.icon_class} mr-2 w-[15%] text-xs`}></i>
                        <span className="w-[85%] text-sm">{option.desc}</span>
                    </button>
                )}
            </div>}
        </div>
    );
};