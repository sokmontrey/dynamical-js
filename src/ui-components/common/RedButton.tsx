import { useState } from "react";

interface IconButtonProps {
    onConfirmed: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function RedButton({
    onConfirmed,
    disabled = false,
    children,
}: IconButtonProps) {
    const [is_finalizing, setIsFinalizing] = useState(false);

    const handleClick = () => {
        if (disabled) return;
        if (!is_finalizing) {
            setIsFinalizing(true);
        } 
    };

    return ( <div className="flex items-center justify-start">
        <div className="overflow-hidden" 
            onBlur={() => setIsFinalizing(false)}
        >
            <div className={`relative transform transition duration-500 ease-in-out ${is_finalizing ? '-translate-x-full' : ''}`}>
                <button className="px-3 py-1 font-mono rounded-lg sur-bg err-color hover:bg-[var(--err-color)] hover:text-[var(--sur-color)] transition-all duration-200"
                    onClick={handleClick}
                >
                    {children}
                </button>
                <button 
                    className={`absolute px-3 py-1 rounded-lg font-mono err-bg sur-color focus:bg-[var(--txt-color)] focus:text-[var(--bg-color)] transition-all duration-200`}
                    onClick={onConfirmed}
                >
                    Really?
                </button>
            </div>
        </div>
    </div>);
}