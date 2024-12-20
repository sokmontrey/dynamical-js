import {useEffect, useState} from "react";
import Editor from "./core/Editor.ts";
import Vec2 from "./utils/Vector.ts";
import SelectButton from "./ui-components/SelectButton.tsx";
import {ModeType} from "./mode/ModeManager.ts";
import {PhysicBodyType} from "./core-physic/PhysicBody.ts";
import PhysicBodyState from "./core/PhysicBodyState.ts";

export default function App() {
	const [mode, setMode] = useState<ModeType | null>(null);
	const [editor_ref, setEditorRef] = useState<Editor | null>(null);

	const state: PhysicBodyState = {
		"point1": {
			type: PhysicBodyType.POINT_MASS,
			props: { is_static: true, },
			renderer: {
				static_position: { radius: 5, fill_color: "red" },
			}
		},
		"point2": {
			type: PhysicBodyType.POINT_MASS,
			props: { position: Vec2.right(100), }
		},
		"rigid1": {
			type: PhysicBodyType.RIGID_CONSTRAINT,
			dependencies: { pointmass1: "point1", pointmass2: "point2", },
			props: { is_broken: false, }
		},
	};

	useEffect(() => {
		const editor = new Editor('canvas-container', state);
		editor.start();
		setEditorRef(editor);
		editor.getModeManager().onModeChange((mode: ModeType) => setMode(mode));
		return () => { editor.pause(); }
	}, []);

	return (<>
		<p style={{color: "white"}}>Mode: {mode ?? "None"}</p>
		<div id='canvas-container' style={{width: "500px", height: "500px"}}></div>
		<button onClick={() => editor_ref?.start()}>Run</button>
		<button onClick={() => editor_ref?.pause()}>Pause</button>
		<button onClick={() => editor_ref?.reset()}>Reset</button>
		<button onClick={() => editor_ref?.save()}>Save</button>
		<button onClick={() => editor_ref?.getModeManager().toMoveMode()}>
			Move
		</button>
		<SelectButton options={editor_ref?.getModeManager().getCreateModeTypes() ?? []}
					  onSelect={(mode: ModeType) => editor_ref?.getModeManager().toCreateMode(mode)}
		></SelectButton>
	</>);
}
