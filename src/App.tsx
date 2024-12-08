import { useEffect, useRef, useState } from "react";
import Editor from "./core/Editor.ts";
import Vec2, { vec2 } from "./utils/Vector.ts";
import PointMass from "./core-physic/PointMass.ts";
import RigidConstraint from "./core-physic/RigidConstraint.ts";

export default function App() {
	const [editor_ref, setEditorRef] = useState<Editor>(null);

	useEffect(() => {
		const editor = new Editor('canvas-container');

		const gravity = vec2(0, 9.8);

		const p1 = new PointMass().enableStatic()
		const p2 = new PointMass().setPosition(Vec2.right(100)).setConstantAcceleration(gravity);
		const p3 = new PointMass().setPosition(Vec2.right(150)).setConstantAcceleration(gravity);
		const p4 = new PointMass().setPosition(Vec2.right(200)).setConstantAcceleration(gravity);

		const d1 = new RigidConstraint(p1, p2);
		const d2 = new RigidConstraint(p2, p3);
		const d3 = new RigidConstraint(p3, p4);
		d1.renderer.stress.enable();

		editor.addBody(p1);
		editor.addBody(p2);
		editor.addBody(p3);
		editor.addBody(p4);
		editor.addBody(d1);
		editor.addBody(d2);
		editor.addBody(d3);

		editor.start();
		setEditorRef(editor);

		// const loop = new Loop(update, render, { sub_steps: 1000 });

		// setLoop(loop);
		// loop.run();
		return () => { editor.pause(); }
	}, []);

	return (<>
		<div id='canvas-container' style={{width: "500px", height: "500px"}}></div>
		<button onClick={() => editor_ref.run()}>Run</button>
		<button onClick={() => editor_ref.pause()}>Pause</button>
	</>);
}
