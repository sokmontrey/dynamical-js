import Tooltip from "./Tooltip";

interface IconButtonProps {
    desc: string;
    icon_class: string;
    onClick: () => void;
    direction?: 'bottom' | 'top' | 'left' | 'right';
    disabled?: boolean;
}

export default function IconButton({ 
    desc,
    icon_class,
    onClick, 
    direction = 'bottom',
    disabled = false,
}: IconButtonProps) {
    return (
        <Tooltip text={desc} direction={direction}>
            {disabled ? 
                <button className="w-10 h-10 flex items-center justify-center rounded-md opacity-50 cursor-not-allowed"  
                    aria-label={desc}
                    disabled={disabled} >
                    <i className={icon_class}></i>
                </button>
            :
                <button className="w-10 h-10 flex items-center justify-center rounded-md sur-bg txt-color hover:bg-[var(--acc-color)] hover:text-[var(--prm-color)] transition-all duration-200"  
                    onClick={onClick}
                    aria-label={desc} >
                    <i className={icon_class}></i>
                </button>
            }
        </Tooltip>
    );
}