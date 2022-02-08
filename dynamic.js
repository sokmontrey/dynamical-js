import VectorClass from './Operator/vector.js';
import VertexClass from './Operator/vertex.js';
const Vector = new VectorClass()
const Vertex = new VertexClass();

export default class Dynamic{
	constructor(){}
	setDynamic(initValue={
		torque: 0,
		force: {x: 0, y: 0},
		velocity: {x: 0, y: 0},
		acceleration: {x: 0, y: 0},
		angularVelocity: 0,
		angularAcceleration: 0,
		momentOfInertia: undefined,
		mass: undefined,
		density: 0.001,
	}){
		this.isDynamic = true;
		this.dynamic = {
			force: initValue.force,
			velocity: initValue.velocity,
			acceleration: initValue.acceleration,
			oldPosition: {x:0,y:0},

			torque: initValue.torque,
			angularVelocity: initValue.angularVelocity,
			angularAcceleration: initValue.angularAcceleration,
			momentOfInertia: null,

			density: initValue.density,
			mass: null,
		}
		this.dynamic['momentOfInertia'] = initValue.momentOfInertia || this.calculateMomentOfInertia();
		this.dynamic['mass'] = initValue.mass || this.calculateMass();
	}
	calculateMass(){
		if(this.type === 'circle'){
			return Math.PI * this.radius * this.radius * this.dynamic.density;
		}else if(this.type === 'dot'){
			return this.dynamic.density;
		}else{
			var i, area = 0;
			const vertices = this.vertices;

			for(i=0; i<vertices.length; i++){
				const vertex = vertices[i];
				const next = vertices[i+1] || vertices[0];
				area += Math.abs(Vector.crossProduct(vertex, next));
			}
			return area * this.dynamic.density;
		}
	}
	calculateMomentOfInertia(){
		if(this.type === 'circle'){
			return this.mass * this.radius * this.radius / 2;
		}else if(this.type === 'dot'){
			return this.mass * this.size * this.size / 2;
		}else{
			const vertices = this.vertices;
			var inertia=0, i;
			var A, B;
			var mass_tri, inertia_tri;
			for(i=0; i<vertices.length; i++){
				A = vertices[i];
				B = vertices[i+1] || vertices[0];
				mass_tri = this.density * Math.abs(Vector.crossProduct(A, B) * 0.5);
				inertia_tri = mass_tri * (Vector.sqrtLength(A) + Vector.sqrtLength(B) + Vector.dotProduct(A, B)) / 6;
				inertia += inertia_tri;
			}
			return inertia;
		}
	}
	setGravity(gravity){
		this.gravity = gravity;
	}
	setStatic(initValue={
		mass: 1,
		force: {x: 0, y: 0},
		velocity: {x: 0, y: 0},
		acceleration: {x: 0, y: 0}
	}){
		this.isDynamic = false;
		this.dynamic = {
			mass: initValue.mass,
			force: initValue.force,
			velocity: initValue.velocity,
			acceleration: initValue.acceleration,
			oldPosition: {x:0,y:0}
		}
	}
	update(deltaTime){
		if(!this.isDynamic) return 0;

		const dynamic = this.dynamic;
		dynamic.oldPosition = this.position;

		dynamic.acceleration.x += dynamic.force.x / dynamic.mass;
		dynamic.acceleration.y += dynamic.force.y / dynamic.mass;

		dynamic.force = {x: 0, y: 0}

		dynamic.velocity = {
			x: dynamic.velocity.x + (this.gravity.x + dynamic.acceleration.x) * deltaTime,
			y: dynamic.velocity.y + (this.gravity.y + dynamic.acceleration.y) * deltaTime
		}
		this.position.x += dynamic.velocity.x * deltaTime;
		this.position.y += dynamic.velocity.y * deltaTime;

		console.log(this.type, " : ", dynamic.mass);

		dynamic.angularVelocity += dynamic.angularAcceleration * deltaTime;
		this.rotation += dynamic.angularVelocity * deltaTime;
		if(dynamic.angularVelocity && this.type!=='dot' && this.type!=='circle'){
			if(this.rotation > Math.PI*2 || this.rotation < -Math.PI*2) 
				this.rotation = 0;
			this.reCalculateBounds();
			this.reCalculateVertices(dynamic.angularVelocity);
		}
	}
	resolveCollision(normal, depth, other){
		if(!this.isDynamic) return 0
		this.dynamic.velocity.x = 0;
		this.dynamic.velocity.y = 0;
		this.position.x += normal.x * (depth)
		this.position.y += normal.y * (depth);
		if(other != null)
			this.resolveVelocity(other);
	}
	resolveVelocity(other){
		const thisDynamic = this.dynamic;
		const otherDynamic = other.dynamic;
		thisDynamic.velocity.x = (thisDynamic.velocity.x - otherDynamic.velocity.x) / 2;
		thisDynamic.velocity.y = (thisDynamic.velocity.y - otherDynamic.velocity.y) / 2;
	}
	reCalculateVertices(angle){
		//TODO: implement a real recaculate because this is rotate vertices by angle not to angle
		this.vertices = Vertex.rotate(this.vertices, angle);
	}
	reCalculateBounds(){
		const vertices = this.vertices;
		this.bounds = {
			minX: Vertex.min(vertices, 'x'),
			minY: Vertex.min(vertices, 'y'),
			maxX: Vertex.max(vertices, 'x'),
			maxY: Vertex.max(vertices, 'y')
		}
	}
}
