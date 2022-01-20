export class Circle{
	constructor(x,y,radius,sides=16){
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
		}
	}
}
export class Point{
	constructor(x,y,size){
		return {
			type: 'point',
			position: {x: x, y:y},
			size: size,

			vertices: [{x: 0, y: 0}],
		};
	}
}
export class Rectangle{
	constructor(x,y,width,height){
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
		}
	}
}
