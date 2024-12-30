import SimulationCanvas from "./ui-components/main-component/SimulationCanvas.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InputManager from "./manager/InputManager.ts";
import BodyManager from "./manager/BodyManager.ts";
import ModeManager from "./manager/ModeManager.ts";
import LoopManager from "./manager/LoopManager.ts";
import BodyTreePanel from "./ui-components/main-component/BodyTreePanel.tsx";
import SimulationControls from "./ui-components/main-component/SimulationControls.tsx";
import ToolBar from "./ui-components/main-component/ToolBar.tsx";
import useCanvasManagement from "./hooks/useCanvasManagement.ts";
import usePhysicsSimulation from "./hooks/usePhysicsSimulation.ts";
import useModeManagement from "./hooks/useModeManager.ts";
import PropertyPanel from "./ui-components/main-component/PropertyPanel.tsx";
import simple_pendulum_state from "./states/simple-pendulum.ts";
import circular_kinematic_test_state from "./states/circular-kinematic-test.ts";
import StateLog from "./ui-components/main-component/StateLog.tsx";
import TopBar from "./ui-components/layout/TopBar.tsx";
import ResizableContainer from "./ui-components/common/ResizableContainer.tsx";

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
	} = usePhysicsSimulation(circular_kinematic_test_state);

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

	const middle_container_ref = useRef<HTMLDivElement>(null);

	const onResize = useCallback(() => {
		if (!middle_container_ref.current) return;
		const { clientWidth: width, clientHeight: height } = middle_container_ref.current;
		canvas_state.base_canvas?.resize(width, height);
		canvas_state.overlay_canvas?.resize(width, height);
	}, [canvas_state]);

	useEffect(() => {
		if (!canvas_state.overlay_canvas) return;
		initializeBodyManager();
		initializeModeManager();
		initializeInputManager();
		resetState();
		initializeLoopManager();
		LoopManager.run();
		LoopManager.render();
		window.addEventListener("resize", onResize);
	}, [canvas_state]);

	return (<div className="flex flex-row w-full">
		<ResizableContainer 
			className="prm-bg h-[100vh] box-border" 
			is_left={true}
			min_width={200}
			max_width={400}
			onResize={onResize}
		>
			<BodyTreePanel 
				selected_body_ids={selected_body_ids}
				body_ids={body_ids} 
				renderUI={renderUI} 
			/>
		</ResizableContainer>

		<div 
			className="flex flex-col flex-grow w-full"
			ref={middle_container_ref}
		>
			<div className="flex flex-row items-center">
				<TopBar onSave={saveState} />
				<StateLog states={states} onStateSelected={switchState} />
			</div>

			<SimulationCanvas 
				onCanvasMounted={setCanvasState} 
			/>
		</div>

		<ResizableContainer 
			className="prm-bg h-[100vh] box-border" 
			is_left={false}
			max_width={400}
			onResize={onResize}
		>
			{selected_body && <PropertyPanel 
				body={selected_body} 
				key={selected_body.getId()} 
			/> }
		</ResizableContainer>
	</div>);
}
