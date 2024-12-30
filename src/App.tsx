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
import circular_kinematic_test_state from "./states/circular-kinematic-test.ts";
import StateLog from "./ui-components/main-component/StateLog.tsx";
import ResizableContainer from "./ui-components/common/ResizableContainer.tsx";
import StateTools from "./ui-components/main-component/StateTools.tsx";

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
		addState,
	} = usePhysicsSimulation(circular_kinematic_test_state);

	const [current_state_index, setCurrentStateIndex] = useState<number>(states.length - 1);

	useEffect(() => {
		setCurrentStateIndex(states.length - 1);
	}, [states]);

	const {
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
			ModeManager.reset();
		});
		BodyManager.loadFromJSON(states[current_state_index].state);
	}, [current_state_index]);

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
		setCurrentStateIndex(index);
		BodyManager.loadFromJSON(states[index].state);
		ModeManager.reset();
		LoopManager.render();
	}, [states]);

	const onExport = useCallback(() => {
		const json = JSON.stringify(states[current_state_index].state, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${states[current_state_index].id}.json`;
		a.click();
	}, [current_state_index]);

	const onImport = useCallback((json_content: string) => {
		const state = JSON.parse(json_content);
		try {
			addState(state);
			switchState(states.length - 1);
			BodyManager.loadFromJSON(state); // TODO: debug why this is necessary
		} catch (error) {
			//TODO: error message handling
			console.error('Error importing state:', error);
		}
	}, []);

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
			className="prm-bg h-[100vh] box-border flex flex-col" 
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
			
			<StateLog 
				current_state={states[current_state_index]}
				states={states} 
				onStateSelected={switchState} 
			/>

			<p className="txt-color opacity-50 m-2">
				NOTE: Changes are not saved automatically.
			</p>
		</ResizableContainer>

		<div 
			className="flex flex-col flex-grow w-full"
		>
			<SimulationCanvas 
				onCanvasMounted={setCanvasState} 
				container_ref={middle_container_ref}
			/>

			<div className="flex flex-row justify-center space-x-2 p-4">
				<div className="tool-container">
					<SimulationControls 
						tooltip_direction="top"
						onRun={() => LoopManager.run()}
						onPause={() => LoopManager.pause()}
						onStep={() => !LoopManager.isRunning() ? LoopManager.step() : null }
onRestart={() => {
							switchState(current_state_index);
							LoopManager.render();
						}}
					/>
				</div>
				<div className="tool-container">
					<ToolBar tooltip_direction="top" />
				</div>
				<div className="tool-container">
					<StateTools 
						tooltip_direction="top"
						onSave={saveState}
						onImport={onImport}
						onExport={onExport}
					/>
				</div>
			</div>
		</div>

		<ResizableContainer 
			className="prm-bg h-[100vh] box-border pt-4" 
			is_left={false}
			min_width={350}
			max_width={500}
			onResize={onResize}
		>
			{/* TODO: move this to move mode*/}
			{/* This way we can switch panel between mode  */}
			<p className="txt-color opacity-50">Properties</p>
			{selected_body && <PropertyPanel 
				body={selected_body} 
				key={selected_body.getId()} 
			/> }
		</ResizableContainer>
	</div>);
}
