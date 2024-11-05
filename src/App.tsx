import { useEffect, useRef } from "react";
import Canvas from "./canvas/Canvas.ts";
import Vec2, { vec2 } from "./utils/math/Vector.ts";
import PointMass from "./physic/PointMass.ts";
import RigidConstraint from "./physic/RigidConstraint.ts";

export default function App() {
	const canvas_ref = useRef(null);

	useEffect(() => {
		if (!canvas_ref.current) return;
		const canvas = new Canvas(canvas_ref.current, {
			width: window.innerWidth,
			height: window.innerHeight
		});
		const steps = 100.0;
		const gravity = vec2(0, 9.8);

		const p1 = new PointMass().enableStatic();
		const p2 = new PointMass().setPosition(Vec2.right(100)).setConstantAcceleration(gravity);
		const p3 = new PointMass().setPosition(Vec2.right(150)).setConstantAcceleration(gravity);
		const p4 = new PointMass().setPosition(Vec2.right(175)).setConstantAcceleration(gravity);

		p2.renderer.position
			.setRadius(10)
			.setFillColor('orange');
		p2.renderer.velocity.enable();

		const d1 = new RigidConstraint(p1, p2);
		const d2 = new RigidConstraint(p2, p3);
		const d3 = new RigidConstraint(p3, p4);

		const update = (dt: number) => {
			const ctx = canvas.getContext();
			if (!ctx) return;
			dt /= steps;

			for (let i = 0; i < steps; i++) {
				p1.update(dt);
				p2.update(dt);
				p3.update(dt);
				p4.update(dt);

				d1.update(dt);
				d2.update(dt);
				d3.update(dt);
			}

			canvas.clear();
			d1.renderer.draw(ctx);
			d2.renderer.draw(ctx);
			d3.renderer.draw(ctx);

			p1.renderer.draw(ctx);
			p2.renderer.draw(ctx);
			p3.renderer.draw(ctx);
			p4.renderer.draw(ctx);
		};

		let animation_frame_id: number;
		let prev_time = 0;
		const _render = (current_time: number) => {
			const dt = Math.min((current_time - prev_time) / 10, 0.16);
			update(dt);
			prev_time = current_time;
			animation_frame_id = window.requestAnimationFrame(_render);
		};
		window.requestAnimationFrame(_render);
		return () => window.cancelAnimationFrame(animation_frame_id);
	}, [canvas_ref]);

	return (<>
		<canvas ref={canvas_ref} ></canvas>
	</>);
}
