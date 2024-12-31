import { useRef, useState, useEffect } from "react";

interface ResizableContainerProps {
    children: React.ReactNode;
    className?: string;
    is_left?: boolean;
    min_width?: number;
    max_width?: number;
    onResize?: () => void;
}

export default function ResizableContainer({
    children,
    className = '',
    is_left = true,
    min_width = 250,
    max_width = 1000,
    onResize,
}: ResizableContainerProps) {
    const container_ref = useRef<HTMLDivElement>(null);
    const [is_dragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState(min_width);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!is_dragging || !container_ref.current) return;
            // prevent text selection
            e.preventDefault();

            const container = container_ref.current as HTMLElement;
            const container_rect = container.getBoundingClientRect();

            const new_width = is_left ?     
                Math.min(max_width, Math.max(min_width, e.clientX - container_rect.left)) : 
                Math.min(max_width, Math.max(min_width, container_rect.right - e.clientX));

            setWidth(new_width);
            onResize?.();
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (is_dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [is_dragging, is_left, min_width, max_width]);

    return (
        <div
            ref={container_ref}
            className={`resizable-container relative flex-shrink-0 ${className} ${is_left ? 'pr-4' : 'pl-4'} overflow-hidden overflow-y-scroll z-100`}
            style={{ width: `${width}px` }}
        >
            {children}
            <div
                className={`absolute top-0 ${is_left ? 'right-0' : 'left-0'} h-full w-4 cursor-col-resize bg-transparent ${is_left ? 'border-r-2' : 'border-l-2'} border-[var(--sur-color)] hover:border-[var(--txt-color)] active:border-[var(--txt2-color)] transition-colors`}
                onMouseDown={() => setIsDragging(true)}
            />
        </div>
    );
};