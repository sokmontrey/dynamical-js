import Renderer from './render.js';
import { Triangle, Rectangle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const point = new Point(-100,-100, 4);
const rect = new Rectangle(100, 100, 100, 50);
const tri = new Triangle(-100, 100, 100, 100, 0, -100);

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.renderLoop([point, rect, tri], (deltaTime, there)=>{
	there.clearCanvas();

	return true;
});
