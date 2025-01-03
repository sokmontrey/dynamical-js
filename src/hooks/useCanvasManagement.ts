import Canvas from "@/core/Canvas";
import BodyManager from "@/manager/BodyManager";
import ModeManager from "@/manager/ModeManager";
import { useState } from "react";

export default function useCanvasManagement() {
    const [canvas_state, setCanvasState] = useState<{
        base_canvas: Canvas | null,
        overlay_canvas: Canvas | null
    }>({
        base_canvas: null,
        overlay_canvas: null
    });

    const renderPhysics = (sub_steps: number) => {
		const base_canvas = canvas_state.base_canvas;
		if (!base_canvas) return;
		base_canvas.clear();
		const bodies = BodyManager.getAllBodies();
		bodies.sort((a, b) => b.getRank() - a.getRank());
		bodies.forEach(
			x => x.renderer.draw(x, base_canvas.getContext(), sub_steps)
		);
    };

    const renderUI = () => {
		const overlay_canvas = canvas_state.overlay_canvas;
		if (!overlay_canvas) return;
		overlay_canvas.clear();
		ModeManager.getCurrentMode()
			.renderer
			.draw(overlay_canvas.getContext() ?? null);
    };

    return {
        canvas_state,
        setCanvasState,
        renderPhysics,
        renderUI
    };
}
