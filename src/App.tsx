import SimulationCanvas from "./ui-components/main-ui/SimulationCanvas.tsx";
import { useCallback, useEffect, useMemo } from "react";
import InputManager from "./manager/InputManager.ts";
import PhysicBodyManager from "./manager/PhysicBodyManager.ts";
import ModeManager from "./mode/ModeManager.ts";
import LoopManager from "./manager/LoopManager.ts";
import BodyTreePanel from "./ui-components/main-ui/BodyTreePanel.tsx";
import simple_pendulum_state from "./states/simple-pendulum.ts";
import SimulationControls from "./ui-components/main-ui/SimulationControls.tsx";
import ToolBar from "./ui-components/main-ui/ToolBar.tsx";
import useCanvasManagement from "./hooks/useCanvasManagement.ts";
import usePhysicsSimulation from "./hooks/usePhysicsSimulation.ts";
import useModeManagement from "./hooks/useModeManager.ts";
import PropertyPanel from "./ui-components/main-ui/PropertyPanel.tsx";

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

	const selected_body = useMemo(() => {
		if (selected_body_ids.length !== 1) return null;
		return PhysicBodyManager.getById(selected_body_ids[0]);
	}, [selected_body_ids]);

	const initializePhysicBodyManager = useCallback(() => {
		PhysicBodyManager.init(state); 
		PhysicBodyManager.setOnTreeChange((body_ids) => {
			setBodyIds(body_ids);
		});
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
		{ selected_body && <PropertyPanel body={selected_body} key={selected_body.getId()} /> }
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
