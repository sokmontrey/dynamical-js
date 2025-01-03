import Canvas from "@/core/Canvas";
import { useRef, useEffect } from "react";

export interface SimulationCanvasProps {
	container_id?: string;
    onCanvasMounted: (canvas: {
        base_canvas: Canvas, 
        overlay_canvas: Canvas 
    }) => void;
    container_ref: React.RefObject<HTMLDivElement | null>;
}

export default function SimulationCanvas({ 
    container_id = "", 
    onCanvasMounted,
    container_ref,
}: SimulationCanvasProps) {
    const base_canvas_ref = useRef<HTMLCanvasElement>(null);
    const overlay_canvas_ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!container_ref?.current || 
            !base_canvas_ref.current || 
            !overlay_canvas_ref.current) return;

        const container_ele = container_ref.current;   
        const base_canvas_ele = base_canvas_ref.current;
        const overlay_canvas_ele = overlay_canvas_ref.current;

        const { clientWidth: width, clientHeight: height } = container_ele;
        const base_canvas = new Canvas(base_canvas_ele, {width, height}).disableMouseEvent();
		const overlay_canvas = new Canvas(overlay_canvas_ele, {width, height}).addMousePositionEvent();

        onCanvasMounted({ base_canvas, overlay_canvas });
    }, [onCanvasMounted, container_ref]);

    return <div 
        id={container_id} 
        ref={container_ref}
        style={{ position: "relative", height: "100%", width: "100%" }}
    >
        <canvas id="base_canvas" ref={base_canvas_ref}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        ></canvas>
        <canvas id="overlay_canvas" ref={overlay_canvas_ref}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        ></canvas>
    </div>;
}