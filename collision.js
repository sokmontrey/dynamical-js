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
						y: -normal.y
					}, depth);
				}
			}
		}
	}
	checkBorder(){
		var i;
		var minX = -this.width/2,
			maxX = this.width/2,
			minY = -this.height/2,
			maxY = this.height/2;

		for(i=0; i<this.allBodies.length; i++){
			var body = this.allBodies[i];
			if(!body.isDynamic) continue;
			var normal = {x:0, y:0}, depth = 0, isCollide = false;
			var bounds = {
				minX: body.bounds.minX + body.position.x,
				minY: body.bounds.minY + body.position.x,
				maxX: body.bounds.maxX + body.position.y,
				maxY: body.bounds.maxY + body.position.y
			};
			if(bounds.minX < minX){
				normal.x= 1; isCollide=true;
				depth=minX-bounds.minX;
			} else if(bounds.maxX > maxX){
				normal.x=-1; isCollide=true;
				depth=bounds.maxX-maxX;
			}

			if(bounds.minY < minY){
				normal.y= 1; isCollide=true;
				depth=minY-bounds.minY;
			} else if(bounds.maxY > maxY){
				normal.y=-1; isCollide=true;
				depth=bounds.maxY-maxY;
			}
			//resolve collision
			if(isCollide){
				body.resolveCollision(normal, depth);
			}
		}
	}
}
export default new Collision();
