interface TooltipProps {
    text: string;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    children: React.ReactNode;
    className?: string;
}

export default function Tooltip({ 
    text, 
    direction = 'bottom', 
    children, 
    className = '' 
}: TooltipProps) {
    const getPositionClasses = () => {
        switch (direction) {
            case 'top':
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 -translate-y-1/2 ml-2';
        }
    };

    return (
        <div className={`relative group inline-block ${className}`}>
            {children}
            <div className={`absolute hidden group-hover:block sur-bg txt-color text-sm rounded px-2 py-1 min-w-max ${getPositionClasses()}`}>
                {text}
            </div>
        </div>
    );
} 