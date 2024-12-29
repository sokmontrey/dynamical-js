import SimulationCanvas from "./ui-components/main-ui/SimulationCanvas.tsx";
import { useCallback, useEffect, useMemo } from "react";
import InputManager from "./manager/InputManager.ts";
import BodyManager from "./manager/BodyManager.ts";
import ModeManager from "./manager/ModeManager.ts";
import LoopManager from "./manager/LoopManager.ts";
import BodyTreePanel from "./ui-components/main-ui/BodyTreePanel.tsx";
import SimulationControls from "./ui-components/main-ui/SimulationControls.tsx";
import ToolBar from "./ui-components/main-ui/ToolBar.tsx";
import useCanvasManagement from "./hooks/useCanvasManagement.ts";
import usePhysicsSimulation from "./hooks/usePhysicsSimulation.ts";
import useModeManagement from "./hooks/useModeManager.ts";
import PropertyPanel from "./ui-components/main-ui/PropertyPanel.tsx";
import simple_pendulum_state_new from "./states/simple-pendulum-new.ts";

export default function App() {
	const {
        canvas_state,
        setCanvasState,
        renderPhysics,
        renderUI
	} = useCanvasManagement();

	const {
		body_ids,
		setBodyIds,
		update,
		resetState,
		saveState,
		states,
	} = usePhysicsSimulation(simple_pendulum_state_new);

	const {
        mode,
        selected_body_ids,
        initializeModeManager,
	} = useModeManagement();

	const selected_body = useMemo(() => {
		if (selected_body_ids.length !== 1) return null;
		return BodyManager.getById(selected_body_ids[0]);
	}, [selected_body_ids]);

	const initializeBodyManager = useCallback(() => {
		BodyManager.init(); 
		BodyManager.setOnTreeChange((body_ids) => {
			setBodyIds(body_ids);
		});
		BodyManager.loadFromJSON(states[0]);
	}, [states]);

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

	const switchState = useCallback((index: number) => {
		BodyManager.loadFromJSON(states[index]);
		ModeManager.reset();
		LoopManager.render();
	}, [states]);

	useEffect(() => {
		if (!canvas_state.overlay_canvas) return;
		initializeBodyManager();
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
		{states.map((state, index) => (
			<div key={index}>
				<button onClick={() => switchState(index)}>Load State {index}</button>
			</div>
		))}
		{/* TODO: commited states list */}
		<ToolBar />
	</>);
}
