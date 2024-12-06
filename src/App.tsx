import { useEffect, useRef, useState } from "react";
import Vec2, { vec2 } from "./utils/Vector.ts";
import PointMass from "./core-physic/PointMass.ts";
import RigidConstraint from "./core-physic/RigidConstraint.ts";
import Loop from "./core/Loop.ts";
import Editor from "./core/Editor.ts";

export default function App() {
	const canvas_ref = useRef(null);
	const [loop_ref, setLoop] = useState<Loop>();

	useEffect(() => {
		const editor = new Editor('canvas-container');

		// const gravity = vec2(0, 9.8);
		//
		// const p1 = new PointMass().enableStatic();
		// const p2 = new PointMass().setPosition(Vec2.right(100)).setConstantAcceleration(gravity);
		// const p3 = new PointMass().setPosition(Vec2.right(150)).setConstantAcceleration(gravity);
		// const p4 = new PointMass().setPosition(Vec2.right(200)).setConstantAcceleration(gravity);
		// p2.renderer.velocity.enable();
		//
		// const d1 = new RigidConstraint(p1, p2);
		// const d2 = new RigidConstraint(p2, p3);
		// const d3 = new RigidConstraint(p3, p4);
		// d1.renderer.stress.enable();

		const update = (dt: number, _: number) => {
			// p1.update(dt);
			// p2.update(dt);
			// p3.update(dt);
			// p4.update(dt);
			//
			// d1.update(dt);
			// d2.update(dt);
			// d3.update(dt);
		};

		// const ctx = editor.base_canvas.getContext();

		const render = (_: number, sub_steps: number) => {
			// editor.base_canvas.clear();
			// d1.renderer.draw(ctx, sub_steps);
			// d2.renderer.draw(ctx, sub_steps);
			// d3.renderer.draw(ctx, sub_steps);
			//
			// p1.renderer.draw(ctx, sub_steps);
			// p2.renderer.draw(ctx, sub_steps);
			// p3.renderer.draw(ctx, sub_steps);
			// p4.renderer.draw(ctx, sub_steps);
		}

		// const loop = new Loop(update, render, { sub_steps: 1000 });

		// setLoop(loop);
		// loop.run();
		// return () => loop.pause();
	}, [canvas_ref]);

	return (<>
		<button onClick={() => loop_ref?.run()}>Run</button>
		<button onClick={() => loop_ref?.pause()}>Pause</button>
		<button onClick={() => loop_ref?.step()}>Step</button>
		<div id='canvas-container'></div>
	</>);
}
