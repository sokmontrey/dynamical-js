import Renderer from './render.js';
import { Circle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const point = new Point(-100,-100, 4);

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.renderLoop([point], (deltaTime, there)=>{
	there.clearCanvas();

	return true;
});
