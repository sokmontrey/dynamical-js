var schemeList = ["#f94144", "#f8961e", "#90be6d", "#577590", "#f3722c", "#f9c74f", "#43aa8b"];

export class Circle{
	constructor(x,y,radius,sides=16,color=undefined){
		var i;

		const vertices = [];
		for(i=0; i<sides; i++){
			vertices.push({
				x: radius * Math.cos(i * 2 * Math.PI / sides), 
				y: radius * Math.sin(i * 2 * Math.PI / sides)
			});
		}

		var bounds = {
			minX: -radius,
			minY: -radius,
			maxX: radius,
			maxY: radius,
		};

		return {
			type: 'circle',
			position: {x: x, y:y},
			radius: radius,

			bounds: bounds,
			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
export class Point{
	constructor(x,y,size,color=undefined){
		var bounds = {
			minX: -size,
			minY: -size,
			maxX: size,
			maxY: size
		};
		return {
			type: 'point',
			position: {x: x, y:y},
			size: size,

			bounds: bounds,
			vertices: [{x: 0, y: 0}],
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Rectangle{
	constructor(x,y,width,height,color=undefined){
		var vertices = [
			{x:-width/2 , y:-height/2},
			{x:-width/2 , y: height/2},
			{x: width/2 , y: height/2},
			{x: width/2 , y:-height/2},
		];
		var bounds = {
			minX: -width/2,
			minY: -height/2,
			maxX: width/2,
			maxY: height/2
		};

		return {
			type: 'rectangle',
			position: {x: x, y:y},
			width: width,
			height: height,

			bounds: bounds,
			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		}
	}
}
export class Triangle{
	constructor(x1,y1, x2,y2, x3,y3, color=undefined){
		var position = {x: (x1+x2+x3)/3, y:(y1+y2+y3)/3} 
		var vertices = [
			{x: x1-position.x, y: y1-position.y},
			{x: x2-position.x, y: y2-position.y},
			{x: x3-position.x, y: y3-position.y},
		];
		var bounds = {
			minX: Math.min(x1,x2,x3)-position.x,
			minY: Math.min(y1,y2,y3)-position.y,
			maxX: Math.max(x1,x2,x3)-position.x,
			maxY: Math.max(y1,y2,y3)-position.y
		};

		return {
			type: 'triangle',
			position: position,

			bounds: bounds,
			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
}
export class Polygon{
	constructor(vertices, color){
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

		var bounds = {
			minX: Math.min(vertices.map(v => v.x)),
			minY: Math.min(vertices.map(v => v.y)),
			maxX: Math.max(vertices.map(v => v.x)),
			maxY: Math.max(vertices.map(v => v.y)),
		};

		return {
			type: 'polygon',
			position: position,

			bounds: bounds,
			vertices: vertices,
			color: color || schemeList[Math.floor(Math.random() * schemeList.length)],
		};
	}
};
