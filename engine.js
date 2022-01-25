class Engine{
	gravity = { x: 0, y: -10 }

	init(renderer, bodies, staticBodies=[]){
		this.renderer = renderer;

		this.bodies = bodies;
		this.staticBodies = staticBodies;
		this.enableGravity(0, -10);
	}
	enableGravity(x=0, y=-10){
		this.gravity = {x: x, y: y};
		this.setBodiesGravity();
	}
	disableGravity(){
		this.gravity = {x: 0, y: 0};
		this.setBodiesGravity();
	}
	setBodiesGravity(){
		var i;
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			body.setGravity(this.gravity);
		}
	}
	updateBodies(deltaTime){
		var i;
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			body.update(deltaTime);
		}
	}
	run(){
		this.renderer.renderLoop(this.bodies, (deltaTime, there)=>{
			there.clearCanvas();
			this.updateBodies(deltaTime);
			return true;
		}, 1);
		this.renderer.render(this.staticBodies, ()=>{}, 0);
	}
}
export default Engine;

