import Renderer from './render.js';
import { Rectangle, Point } from './body.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const point1 = new Point(100, 100);
const polygon = new Rectangle(100, 100, 100, 100);

const Render = new Renderer();
Render.init(canvas);
Render.setWireFrame(false);
Render.renderLoop([point1, polygon], (deltaTime, there)=>{
	there.clearCanvas();

	window.addEventListener('mousemove', (e)=>{
		const mouseX=e.clientX - there.canvas.width/2;
		const mouseY=e.clientY - there.canvas.height/2;

		point1.position.x = mouseX;
		point1.position.y = mouseY;
		const c = checkCollision(point1, polygon);
		if(c){ polygon.color = "#ff0000"; point1.color = '#ff0000'; }
		else{ polygon.color = "#00ff00"; point1.color = '#00ff00'; }
	});

	return true;
});

function checkCollision(points, polygon){
	const vertices = polygon.vertices;
	const pp = polygon.position;
	const p = points.position;
	var intersections = 0;

	for(var i=0; i<vertices.length; i++){
		const a = vertices[i];
		const b = vertices[i+1] || vertices[0];

		if(
			p.y < a.y+pp.y != p.y < b.y+pp.y &&
			p.x < (b.x+pp.x-a.x+pp.x) * (p.y-a.y+pp.y) / (b.y+pp.y - a.y+pp.y) + a.x+pp.x
		){
			intersections++;
		}
	}

	return intersections % 2 == 0 ? false : true;
}
