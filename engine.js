import Collision from './collision.js';

class Engine{
	gravity = { x: 0, y: -10 }
	stop = false;

	//public---------------
	init(renderer, bodies, staticBodies=[]){
		this.renderer = renderer;
		this.renderer.createLayer(0);
		this.renderer.createLayer(-1);

		this.setDynamicBodies(bodies);
		this.setStaticBodies(staticBodies);
		this.enableGravity(0, -10);
	}
	run(){
		var count = 0;
		this.renderer.renderLoop(this.bodies, (deltaTime, there)=>{
			there.clearCanvas(0);
			this.updateBodies(deltaTime);
			this.checkCollision();

			if(this.stop) return false;
			return true; 
		}, 0);
		this.renderer.render(this.staticBodies, ()=>{}, -1);
	}
	enableGravity(x=0, y=-10){
		this.gravity = {x: x, y: y};
		this.setBodiesGravity();
	}
	disableGravity(){
		this.gravity = {x: 0, y: 0};
		this.setBodiesGravity();
	}

	//private-----------
	updateBodies(deltaTime){
		var i;
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			body.update(deltaTime);
		}
	}
	checkCollision(){
		var i, j;
		//sort bodies by x axis with bounds
		this.bodies.sort((a, b)=>{
			return a.position.x + a.bounds.minX - 
				b.position.x + b.bounds.minX;
		});
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			const [isBorder, borderDirection] = Collision.border(
				body, 
				this.renderer.width, 
				this.renderer.height);
			if(isBorder) body.resolveCollision(borderDirection);
			for(j=i+1; j<this.bodies.length; j++){
				const nextBody = this.bodies[j];
				const isInBounds = Collision.isInBounds(body, nextBody);
				if(isInBounds){
					var [isPolygon, polygonDirection] = Collision.check(
						body, nextBody
					);
					//TODO: devide polygonDirection to 2 for each body
					if(isPolygon){
						body.resolveCollision(polygonDirection);
						nextBody.resolveCollision(polygonDirection);
					}
				}else continue;
			}
		}
	}
	setDynamicBodies(bodies){
		this.bodies = bodies;
		var i;
		for(i=0; i<this.bodies.length; i++){
			this.bodies[i].setDynamic();
		}
	}
	setStaticBodies(bodies){
		this.staticBodies = bodies;
		var i;
		for(i=0; i<this.staticBodies.length; i++){
			this.staticBodies[i].setStatic();
		}
	}

	setBodiesGravity(){
		var i;
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			body.setGravity(this.gravity);
		}
	}
}
export default Engine;

