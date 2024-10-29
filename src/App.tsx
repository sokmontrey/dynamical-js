import { useEffect, useRef} from "react";
import Canvas from "./interfaces/Canvas";
import Vec2 from "./utils/math/Vector";

export default function App() {
	const canvas_ref = useRef(null);

	useEffect(() => {
		if (!canvas_ref.current) return;
		const canvas = new Canvas(canvas_ref.current, {
			width: window.innerWidth,
			height: window.innerHeight
		});

		const update = (dt: number) => {
		};

		let animation_frame_id: number;
		let prev_time = 0;
		const _render = (current_time: number) => {
			const dt = Math.min((current_time - prev_time) / 1000, 0.016);
			update(dt);
			prev_time = current_time;
			animation_frame_id = window.requestAnimationFrame(_render);
		};
		window.requestAnimationFrame(_render);
		return () => window.cancelAnimationFrame(animation_frame_id);
	}, [canvas_ref]);

	return ( <>
		<canvas ref={canvas_ref} ></canvas>
	</>);
}
