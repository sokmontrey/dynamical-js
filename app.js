import Renderer from './render.js';
import { Polygon, Triangle, Rectangle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const point = new Point(-100,-100, 4);
const rect = new Rectangle(100, 100, 100, 50);
const tri = new Triangle(-100, 100, 100, 100, 0, -100);
const poly = new Polygon([
	{x: -100, y: -100},
	{x: 100, y: -100},
	{x: 0, y: 100}
]);
console.log(poly);

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.renderLoop([point, rect, poly], (deltaTime, there)=>{
	there.clearCanvas();

	return true;
});
