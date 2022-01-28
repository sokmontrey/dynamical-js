import Detector from './detector.js';

class Collision{
	algorithm = 'broadphase'
	useBroadphase(){
		this.algorithm = 'broadphase';
	}
	setBodies(dynamicBodies, staticBodies){
		this.allBodies = dynamicBodies.concat(staticBodies);
	}
	setBorder(width, height){
		this.width = width;
		this.height = height;
	}
	check(){
		//sort bodies by bounds.minX
		this.allBodies.sort(function(a,b){
			return a.bounds.minX - b.bounds.minX;
		});
		this.checkBorder();
		if(this.algorithm == 'broadphase'){
			this.broadphase();
		}
	}
	broadphase(){
		var i, j;
		var bodyA, bodyB;
		var isCollide=false, 
			normal={x:0,y:0}, 
			depth=0;

		for(i=0; i<this.allBodies.length; i++){
			bodyA = this.allBodies[i];

			for(j=i+1; j<this.allBodies.length; j++){
				bodyB = this.allBodies[j];

				if(bodyB.minX > bodyA.maxX) continue;
				if(Detector.isInBounds(bodyA, bodyB)) continue;

				[isCollide, normal, depth] = Detector.isCollide(bodyA, bodyB);
				if(isCollide) {
					bodyA.resolveCollision(normal, depth);
					bodyB.resolveCollision({
						x: -normal.x,
						y: -normal.y }, depth);
				}//end of if

			}//end of for j
		}//end of for i

	}
	checkBorder(){
		var i;
		var isCollide=false,
			normal={x:0,y:0}, 
			depth=0;
		for(i=0; i<this.allBodies.length; i++){
			var body = this.allBodies[i];
			if(!body.isDynamic) continue;

			[isCollide,normal,depth] = Detector.checkBorder(body, this.width, this.height);
			if(isCollide) {
				body.resolveCollision(normal, depth);
			}
		}
	}
}
export default new Collision();
