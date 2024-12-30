import Tooltip from "./Tooltip";

interface IconButtonProps {
    desc: string;
    icon_class: string;
    onClick: () => void;
    direction?: 'bottom' | 'top' | 'left' | 'right';
    disabled?: boolean;
    focused?: boolean;
}

export default function IconButton({ 
    desc,
    icon_class,
    onClick, 
    direction = 'bottom',
    disabled = false,
    focused = false,
}: IconButtonProps) {
    return (
        <Tooltip text={desc} direction={direction}>
            {disabled ? 
                <button className="w-9 h-9 text-sm flex items-center justify-center rounded-md opacity-50 cursor-not-allowed"  
                    aria-label={desc}
                    disabled={disabled} >
                    <i className={icon_class}></i>
                </button>
            :
                <button className={`w-9 h-9 text-sm flex items-center justify-center rounded-md ${focused ? "acc-bg bg-color" : "sur-bg"} hover:bg-[var(--acc-color)] hover:text-[var(--prm-color)] transition-all duration-200`}  
                    onClick={onClick}
                    aria-label={desc} >
                    <i className={icon_class}></i>
                </button>
            }
        </Tooltip>
    );
}