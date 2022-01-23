import Vertex from './Operator/vertex.js';
var schemeList = ["#f94144", "#f8961e", "#90be6d", "#577590", "#f3722c", "#f9c74f", "#43aa8b"];

export class Circle{
	constructor(
		x=0,
		y=0,
		radius=50,
		sides=16,
		color=undefined
	){
		var i;
		var vertices = [];
		for(i=0; i<sides; i++){
			vertices.push({
				x: radius * Math.cos(i * 2 * Math.PI / sides), 
				y: radius * Math.sin(i * 2 * Math.PI / sides)
			});
		}
		var bounds = {
			minX:-radius,
			minY:-radius,
			maxX: radius,
			maxY: radius
		}

		return {
			type: 'circle',
			position: {x: x, y:y},
			radius: radius,

			vertices: vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
export class Point{
	constructor(
		x=0,
		y=0,
		size=4,color=undefined
	){
		var bounds = {
			minX:-size,
			minY:-size,
			maxX: size,
			maxY: size
		}
		return {
			type: 'point',
			position: {x: x, y:y},
			size: size,

			vertices: [{x: 0, y: 0}],
			bounds: bounds, 
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Line{
	constructor(
		x1=-50,
		y1=0,
		x2=50,
		y2=0,
		size=4, 
		angle=0,
		color=undefined
	){
		var i;
		const position = {
			x: (x1+x2)/2, 
			y: (y1+y2)/2
		};
		var vertices = [
			{x: x1-position.x, y: y1-position.y}, 
			{x: x2-position.x, y: y2-position.y}
		];

		if(angle)
			vertices = Vertex.rotate(vertices, angle);

		var bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y'),
		}
		return {
			type: 'line',
			position: position,
			size: size,

			vertices:vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Rectangle{
	constructor(
		x=0,
		y=0,
		width=100,
		height=50,
		angle=0,
		color=undefined
	){
		var vertices = [
			{x:-width/2, y:-height/2},
			{x:-width/2, y: height/2},
			{x: width/2, y: height/2},
			{x: width/2, y:-height/2},
		];
		if(angle)
			vertices = Vertex.rotate(vertices, angle);
		var bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y'),
		}
		return {
			type: 'rectangle',
			position: {x: x, y:y},
			width: width,
			height: height,

			vertices: vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
export class Triangle{
	constructor(
		x1=10 , y1=10, 
		x2=0  , y2=-7, 
		x3=-10, y3=10, 
		angle=0,
		color=undefined
	){
		var cos = Math.cos(angle),
			sin = Math.sin(angle);
		var position = {x: (x1+x2+x3)/3, y:(y1+y2+y3)/3} 
		var vertices = [
			{x: x1-position.x, y: y1-position.y},
			{x: x2-position.x, y: y2-position.y},
			{x: x3-position.x, y: y3-position.y},
		];
		if(angle)
			vertices = Vertex.rotate(vertices, angle);
		var bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y'),
		};

		return {
			type: 'triangle',
			position: position,

			vertices: vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Polygon{
	constructor(
		vertices, 
		angle, 
		color=undefined
	){
		var i;
		var position = {x: 0, y:0};

		for(i=0; i<vertices.length; i++){
			position.x += vertices[i].x;
			position.y += vertices[i].y;
		}
		position.x /= vertices.length;
		position.y /= vertices.length;

		for(i=0; i<vertices.length; i++){
			vertices[i].x += -position.x;
			vertices[i].y += -position.y;
		}
		if(angle)
			vertices = Vertex.rotate(vertices, angle);

		var bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y'),
		}

		return {
			type: 'polygon',
			position: position,

			vertices: vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
};
export class SymPolygon{
	constructor(
		x=0, 
		y=0,
		radius=50, 
		sides=6,
		angle=0,
		color=undefined,
	){
		var i;
		var vertices = [];
		for(i=0; i<sides; i++){
			vertices.push({
				x: radius * Math.cos(i * 2 * Math.PI / sides),
				y: radius * Math.sin(i * 2 * Math.PI / sides)
			});
		}
		if(angle)
			vertices = Vertex.rotate(vertices, angle);

		var bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y'),
		}

		return{
			type: 'polygon',
			position: {x: x, y:y},
			radius: radius,

			vertices: vertices,
			bounds: bounds,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
