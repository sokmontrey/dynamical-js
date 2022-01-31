
export default class Dynamic{
	constructor(){}
	setDynamic(initValue={
		mass: 1,
		force: {x: 0, y: 0},
		velocity: {x: 0, y: 0},
		acceleration: {x: 0, y: 0},
		angularVelocity: 0,
		angularAcceleration: 0,
		momentOfInertia: 1,
	}){
		this.isDynamic = true;
		this.dynamic = {
			mass: initValue.mass,
			force: initValue.force,
			velocity: initValue.velocity,
			acceleration: initValue.acceleration,
			oldPosition: {x:0,y:0},

			angularVelocity: initialValue.angularVelocity,
			angularAcceleration: initialValue.angularAcceleration,
			momentOfInertia: initialValue.momentOfInertia,
		}
	}
	setGravity(gravity){
		this.gravity = gravity
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

		dynamic.angularVelocity += dynamic.angularAcceleration * deltaTime;
		this.rotation += dynamic.angularVelocity * deltaTime;
		if(dynamic.angularVelocity){
			this.reCalculateBounds();
		}
		//TODO: implement moment of inertia and stuff
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
