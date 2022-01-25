import Vertex from './Operator/vertex.js';
var schemeList = ["#f94144", "#f8961e", "#90be6d", "#577590", "#f3722c", "#f9c74f", "#43aa8b"];

class Dynamic{
	constructor(){}
	setDynamic(initValue={
		mass: 1,
		force: {x: 0, y: 0},
		velocity: {x: 0, y: 0},
		acceleration: {x: 0, y: 0}
	}){
		this.isDynamic = true;
		this.dynamic = {
			mass: initValue.mass,
			force: initValue.force,
			velocity: initValue.velocity,
			acceleration: initValue.acceleration
		}
	}
	setGravity(gravity){
		this.gravity = gravity
	}
	setStatic(initValue){
		this.isDynamic = false;
		this.static = {
			//something
		}
	}
	update(deltaTime){
		if(!this.isDynamic) return 0;

		this.dynamic.acceleration = {
			x: this.dynamic.force.x / this.dynamic.mass,
			y: this.dynamic.force.y / this.dynamic.mass
		}
		this.dynamic.velocity = {
			x: this.dynamic.velocity.x + (this.gravity.x + this.dynamic.acceleration.x) * deltaTime,
			y: this.dynamic.velocity.y + (this.gravity.y + this.dynamic.acceleration.y) * deltaTime
		}
		this.position.x += this.dynamic.velocity.x * deltaTime;
		this.position.y += this.dynamic.velocity.y * deltaTime;
	}

	resolveCollisionManifold(direction){
		if(!this.isDynamic) return 0;
		this.color = 'red';

		this.position.x += direction.x;
		this.position.y += direction.y;
	}
}
export class Circle extends Dynamic{
	constructor(
		x=0,
		y=0,
		radius=50,
		sides=16,
		color=undefined
	){
		super();
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

		this.type= 'circle';
		this.position= {x: x, y:y};
		this.radius= radius;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
export class Dot extends Dynamic{
	constructor(
		x=0,
		y=0,
		size=4,color=undefined
	){
		super();
		var bounds = {
			minX:-size,
			minY:-size,
			maxX: size,
			maxY: size
		}
		this.type= 'dot';
		this.position= {x: x, y:y};
		this.size= size;

		this.vertices= [{x:0, y:0}];
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
export class Line extends Dynamic{
	constructor(
		x1=-50,
		y1=0,
		x2=50,
		y2=0,
		size=4, 
		angle=0,
		color=undefined
	){
		super();
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
		this.type= 'line';
		this.position= position;
		this.size= size;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
export class Rectangle extends Dynamic{
	constructor(
		x=0,
		y=0,
		width=100,
		height=50,
		angle=0,
		color=undefined
	){
		super();
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
		this.type= 'rectangle';
		this.position= {x:x, y:y};
		this.width= width;
		this.height= height;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
export class Triangle extends Dynamic{
	constructor(
		x1=10 , y1=10, 
		x2=0  , y2=-7, 
		x3=-10, y3=10, 
		angle=0,
		color=undefined
	){
		super();
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

		this.type= 'triangle';
		this.position= position;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
export class Polygon extends Dynamic{
	constructor(
		vertices, 
		angle, 
		color=undefined
	){
		super();
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

		this.type= 'polygon';
		this.position= position;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
};
export class SymetricalPolygon extends Dynamic{
	constructor(
		x=0, 
		y=0,
		radius=50, 
		sides=6,
		angle=0,
		color=undefined,
	){
		super();
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

		this.type= 'symetricalPolygon';
		this.position= {x: x, y:y};
		this.radius= radius;

		this.vertices= vertices;
		this.bounds= bounds;
		this.color= color || schemeList[Math.floor(Math.random() * schemeList.length)];
	}
}
