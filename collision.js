class Collision{
	border(polygon, width, height){
		const polygonBounds = polygon.bounds;
		const position = polygon.position;
		const bounds = {
			minX: position.x + polygonBounds.minX,
			minY: position.y + polygonBounds.minY,
			maxX: position.x + polygonBounds.maxX,
			maxY: position.y + polygonBounds.maxY
		}

		var direction = {x: 0, y:0};
		if(bounds.minX < -width/2){
			direction.x = -width/2 - bounds.minX;
		}else if(bounds.maxX > width/2){
			direction.x = width/2 - bounds.maxX;
		}

		if(bounds.minY < -height/2){
			direction.y = -height/2 - bounds.minY;
		}else if(bounds.maxY > height/2){
			direction.y = height/2 - bounds.maxY;
		}

		if(direction.x || direction.y){
			return [true, direction];
		}else return [false, null];
	}

	isInBounds(polygon1, polygon2){
		const bounds1 = {
			minX: polygon1.position.x + polygon1.bounds.minX,
			minY: polygon1.position.y + polygon1.bounds.minY,
			maxX: polygon1.position.x + polygon1.bounds.maxX,
			maxY: polygon1.position.y + polygon1.bounds.maxY
		}
		const bounds2 = {
			minX: polygon2.position.x + polygon2.bounds.minX,
			minY: polygon2.position.y + polygon2.bounds.minY,
			maxX: polygon2.position.x + polygon2.bounds.maxX,
			maxY: polygon2.position.y + polygon2.bounds.maxY
		}

		if(bounds1.minX > bounds2.maxX || 
			bounds1.maxX < bounds2.minX) return false;
		if(bounds1.minY > bounds2.maxY || 
			bounds1.maxY < bounds2.minY) return false;

		return true;
	}
	check(polygon1, polygon2){
		if(polygon1.type === "circle" && polygon2.type === "circle"){
			return this.circleCircle(polygon1, polygon2);
		}else if(polygon1.type=== "circle" && polygon2.type === "dot"
				||polygon1.type === "dot" && polygon2.type==="circle"){
			if(polygon1.type ==='circle'){
				return this.pointCircle(polygon1, polygon2);
			}else{
				return this.pointCircle(polygon2, polygon1);
			}
		}else if(polygon1.type==='circle' || polygon2.type==='circle'){
			if(polygon1.type === 'circle'){
				return this.circlePolygon(polygon1, polygon2);
			}else{
				return this.circlePolygon(polygon2, polygon1);
			}
		}else{
			return this.polygonPolygon(polygon1, polygon2);
		}
	}
	//check for collision between polygons by
	//pick a polygon that has the smallest vertices number
	//and loop through all the vertices of the other polygon
	//and check if the point is inside the polygon using ray casting
	polygonPolygon(polygon1, polygon2){
		var i;

		for(i=0; i<polygon1.vertices.length; i++){
			var collide = this.pointPolygon({
				x: polygon1.vertices[i].x + polygon1.position.x,
				y: polygon1.vertices[i].y + polygon1.position.y
			}, polygon2);
			if(collide[0]) return collide;
		}
		for(i=0; i<polygon2.vertices.length; i++){
			var collide = this.pointPolygon({
				x: polygon2.vertices[i].x + polygon2.position.x,
				y: polygon2.vertices[i].y + polygon2.position.y
			}, polygon1) 
			if(collide[0]) return collide;
		}

		return [false,null];
	}
	circlePolygon(circle, polygon){
		var i;
		const vertices = polygon.vertices;
		for(i=0; i<vertices.length; i++){
			var collide = this.pointCircle({
				x: vertices[i].x + polygon.position.x,
				y: vertices[i].y + polygon.position.y
			}, circle);
			if(collide[0]) return collide;
		}
		return [false, null];
	}
	circleCircle(circle1, circle2){
		var distance = Math.sqrt(
			Math.pow(circle1.position.x - circle2.position.x, 2) +
			Math.pow(circle1.position.y - circle2.position.y, 2)
		);
		if(distance < circle1.radius + circle2.radius){
			var d_to_edge = circle1.radius + circle2.radius - distance;
			var normal = {
				x: d_to_edge*(circle1.position.x - circle2.position.x)/distance,
				y: d_to_edge*(circle1.position.y - circle2.position.y)/distance
			}
			return [true, normal];
		}
		return [false, null]
	}

	pointCircle(point, circle){
		var distance = Math.sqrt(
			Math.pow(point.x - circle.position.x, 2) + 
			Math.pow(point.y - circle.position.y, 2)
		);
		if(distance < circle.radius){
			var d_to_edge = circle.radius - distance;
			var normal = {
				x: d_to_edge*(point.x - circle.position.x)/distance,
				y: d_to_edge*(point.y - circle.position.y)/distance
			}
			return [true, normal];
		}
		return [false, null]
	}
	//using ray casting from the point to the very right
	//if the point is inside the polygon the number of intersections is odd
	//if the point is outside the polygon the number of intersections is even
	pointPolygon(point, polygon){
		var i;
		var intersect = 0;
		const vertices = polygon.vertices;

		const p = {
			x: point.x, 
			y: point.y
		};
		var normal = {x: 0, y: 0};
		var old_distance = Infinity;

		for(i=0; i<vertices.length; i++){
			const a = {
				x: vertices[i].x + polygon.position.x,
				y: vertices[i].y + polygon.position.y
			}
			const next = vertices[i+1] || vertices[0]; 
			const b = {
				x: next.x + polygon.position.x,
				y: next.y + polygon.position.y
			}

			//find closest point from the point to edge
			var abx = b.x - a.x + 1e-8,
				aby = b.y - a.y + 1e-8;
			var ab_distance = Math.sqrt(abx*abx + aby*aby);

			const distance = Math.abs(
				aby*p.x - abx*p.y + b.x*a.y-b.y*a.x
			) / ab_distance;

			const d_over_ab = distance / ab_distance;
			var dx = aby * d_over_ab;
			var dy = abx * d_over_ab;

			//get x value from segment a and b by knowing y from p.y
			const x = (p.y - a.y) * (b.x - a.x) / (b.y - a.y) + a.x;
			if(distance < old_distance){
				if(x > p.x) normal = {x: -dx, y:dy};
				else normal = {x: dx, y:dy}

				old_distance = distance;
			}

			if(p.y > Math.min(a.y, b.y) && p.y < Math.max(a.y, b.y) ){
				if(p.x > Math.max(a.x, b.x)) continue;
				if(x > p.x) intersect++;
			}else continue;
		}
		return intersect % 2 === 1 ? [true, normal] : [false, null];
	}	
}
export default new Collision();
