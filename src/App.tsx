import SimulationCanvas from "./ui-components/SimulationCanvas.tsx";
import { useCallback, useEffect } from "react";
import InputManager from "./manager/InputManager.ts";
import PhysicBodyManager from "./manager/PhysicBodyManager.ts";
import ModeManager from "./mode/ModeManager.ts";
import LoopManager from "./manager/LoopManager.ts";
import BodyTreePanel from "./ui-components/BodyTreePanel.tsx";
import simple_pendulum_state from "./states/simple-pendulum.ts";
import SimulationControls from "./ui-components/SimulationControls.tsx";
import ToolBar from "./ui-components/ToolBar.tsx";
import useCanvasManagement from "./hooks/useCanvasManagement.ts";
import usePhysicsSimulation from "./hooks/usePhysicsSimulation.ts";
import useModeManagement from "./hooks/useModeManager.ts";

export default function App() {
	const {
        canvas_state,
        setCanvasState,
        renderPhysics,
        renderUI
	} = useCanvasManagement();

	const {
		state,
		body_ids,
		setBodyIds,
		update,
		resetState,
		saveState,
	} = usePhysicsSimulation(simple_pendulum_state);

	const {
        mode,
        selected_body_ids,
        initializeModeManager,
	} = useModeManagement();

	const initializePhysicBodyManager = useCallback(() => {
		PhysicBodyManager.init(state); 
		PhysicBodyManager.setOnTreeChange(setBodyIds);
	}, [state]);

	const initializeInputManager = useCallback(() => {
		if (!canvas_state.overlay_canvas) return;
		InputManager.init(canvas_state.overlay_canvas);
		InputManager.onMouseMove(() => {
			ModeManager.onMouseMove();
			if (!LoopManager.isRunning()) renderUI();
		});
		InputManager.onMouseDown(ModeManager.onMouseDown);
		InputManager.onMouseUp(ModeManager.onMouseUp);
		InputManager.onMouseClick(ModeManager.onMouseClick);
	}, [canvas_state.overlay_canvas]);

	const initializeLoopManager = useCallback(() => {
		LoopManager.init(update, (_, sub_steps: number) => {
			renderPhysics(sub_steps);
			renderUI();
		}, { sub_steps: 1000, constant_dt: null, });
	}, [update, renderPhysics, renderUI]);

	useEffect(() => {
		if (!canvas_state.overlay_canvas) return;
		initializePhysicBodyManager();
		initializeModeManager();
		initializeInputManager();
		resetState();
		initializeLoopManager();
		LoopManager.run();
	}, [canvas_state]);

	return (<>
		<SimulationCanvas onCanvasMounted={setCanvasState} />
		<BodyTreePanel 
			selected_body_ids={selected_body_ids}
			body_ids={body_ids} 
			renderUI={renderUI} />
		<p> Mode: {mode ?? "None"} </p>
		<SimulationControls 
			onRun={LoopManager.run}
			onPause={LoopManager.pause}
			onStep={() => LoopManager.step()}
			onReset={resetState}
			onSave={saveState}
		/>
		<ToolBar />
	</>);
}
