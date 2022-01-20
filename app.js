import Renderer from './render.js';
import { Polygon, Triangle, Rectangle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const points = [];
for(var i=0; i<40; i++){
	points.push(new Point(Math.random()*canvas.width, Math.random()*canvas.height));
};

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.renderLoop(points, (deltaTime, there)=>{
	there.clearCanvas();

	return true;
});
