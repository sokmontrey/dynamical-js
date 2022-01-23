import Renderer from './render.js';
import { Polygon, Rectangle } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);

const rect = new Rectangle(0, 0, 100, 100);
const polygon = new Polygon([
	//create set of point that create star shape width {x: 0, y: 0} as center
	{x: -100, y: 0},
	{x: -50, y: 0},
	{x: 0, y: 100},
	{x: 50, y: 0},
	{x: 100, y: 0},
	{x: 0, y: -100}
]);



/*
function checkBorder(polygon, width, height){
	var i;
	const vertices = polygon.vertices;
	for(i=0; i<vertices.length; i++){
		var x = vertices[i].x + polygon.position.x,
			y = vertices[i].y + polygon.position.y;
		if(x < -width/2 || x > width/2 || y < -height/2 || y > height/2){
			return true;
		}
	}
	return false;
}

function checkPoly(polygon1, polygon2){
	var i;
	var collide = false;
	for(i=0; i<polygon2.vertices.length; i++){
		collide = checkCollision({
			x: polygon2.vertices[i].x + polygon2.position.x,
			y: polygon2.vertices[i].y + polygon2.position.y
		}, polygon1) 
		if(collide) return true;
	}

	for(i=0; i<polygon1.vertices.length; i++){
		collide = checkCollision({
			x: polygon1.vertices[i].x + polygon1.position.x,
			y: polygon1.vertices[i].y + polygon1.position.y
		}, polygon2);
		if(collide) return true;
	}
	return false;
}

function checkCollision(point, polygon){
	var i;
	const vertices = polygon.vertices;
	const p = {
		x: point.x, 
		y: point.y
	};
	var intersect = 0;

	for(i=0; i<vertices.length; i++){
		const a = {
			x: vertices[i].x + polygon.position.x,
			y: vertices[i].y + polygon.position.y
		}
		const next = vertices[i+1] || vertices[0]; 
		const b = {
			x: next.x + polygon.position.x,
			y: next.y + polygon.position.y
		}

		if(p.y > Math.min(a.y, b.y) && p.y < Math.max(a.y, b.y) ){
			if(p.x > Math.max(a.x, b.x)) continue;

			//get x value from segment a and b by knowing by from p.y
			const x = (p.y - a.y) * (b.x - a.x) / (b.y - a.y) + a.x;
			if(x > p.x) intersect++;
		}else continue;
	}
	return intersect % 2 === 1;
}
*/
