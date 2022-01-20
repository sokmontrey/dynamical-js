import Renderer from './render.js';
import { Polygon, Triangle, Rectangle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const point = new Point(-100,-100, 4);
const rect = new Rectangle(100, 100, 100, 50);
const poly = new Polygon([
	{x: -100, y: -100},
	{x: 100, y: -100},
	{x: 0, y: 100}
]);

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.setShowBounds(true);
Render.renderLoop([point, rect, poly], (deltaTime, there)=>{
	there.clearCanvas();

	return true;
});
