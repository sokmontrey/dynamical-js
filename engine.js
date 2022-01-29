import DetectorClass from './detector.js';
import CollisionClass from './collision.js';

const Collision = new CollisionClass();
const Detector = new DetectorClass();

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
		Collision.setBodies(this.bodies, this.staticBodies);
		Collision.setBorder(renderer.width, renderer.height);
	}
	run(){
		var count = 0;
		this.renderer.renderLoop(this.bodies, (deltaTime, there)=>{
			there.clearCanvas(0);
			this.updateBodies(deltaTime * 10);
			Collision.check();

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

