class Engine{
	gravity = { x: 0, y: -10 }
	isGravity = true;

	setRender(renderer){
		this.renderer = renderer;
	}
	setBody(bodies, staticBodies=[]){
		var i;
		this.bodies = bodies;
		this.staticBodies = staticBodies;
	}
	enableGravity(x=0, y=-10){
		this.isGravity = true;
		this.gravity = {x: x, y: y};
	}
	disableGravity(){
		this.isGravity = false;
	}
	updateBodies(deltaTime){
		var i;
		for(i=0; i<this.bodies.length; i++){
			const body = this.bodies[i];
			body.update(deltaTime, {
				x: this.gravity.x,
				y: this.gravity.y
			});
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
export default new Engine();

