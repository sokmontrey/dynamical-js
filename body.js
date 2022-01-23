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

		const vertices = [];
		for(i=0; i<sides; i++){
			vertices.push({
				x: radius * Math.cos(i * 2 * Math.PI / sides), 
				y: radius * Math.sin(i * 2 * Math.PI / sides)
			});
		}

		return {
			type: 'circle',
			position: {x: x, y:y},
			radius: radius,

			vertices: vertices,
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
		return {
			type: 'point',
			position: {x: x, y:y},
			size: size,

			vertices: [{x: 0, y: 0}],
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
		size=4, color=undefined
	){
		const position = {
			x: (x1+x2)/2, 
			y: (y1+y2)/2
		};
		const vertices = [
			{x: x1-position.x, y: y1-position.y}, 
			{x: x2-position.x, y: y2-position.y}
		];
		return {
			type: 'line',
			position: position,
			size: size,

			vertices:vertices,
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
		color=undefined
	){
		var vertices = [
			{x:-width/2 , y:-height/2},
			{x:-width/2 , y: height/2},
			{x: width/2 , y: height/2},
			{x: width/2 , y:-height/2},
		];

		return {
			type: 'rectangle',
			position: {x: x, y:y},
			width: width,
			height: height,

			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
export class Triangle{
	constructor(
		x1=10 , y1=10, 
		x2=0  , y2=-7, 
		x3=-10, y3=10, 
		color=undefined
	){
		var position = {x: (x1+x2+x3)/3, y:(y1+y2+y3)/3} 
		var vertices = [
			{x: x1-position.x, y: y1-position.y},
			{x: x2-position.x, y: y2-position.y},
			{x: x3-position.x, y: y3-position.y},
		];

		return {
			type: 'triangle',
			position: position,

			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Polygon{
	constructor(vertices, color=undefined){
		var i;
		var position = {x: 0, y:0};

		for(i=0; i<vertices.length; i++){
			position.x += vertices[i].x;
			position.y += vertices[i].y;
		}
		position.x /= vertices.length;
		position.y /= vertices.length;

		for(i=0; i<vertices.length; i++){
			vertices[i].x -= position.x;
			vertices[i].y -= position.y;
		}

		return {
			type: 'polygon',
			position: position,

			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
};
