export default Detector;
class Detector{
	checkBorder(polygon, width, height){
		const polygonBounds = polygon.bounds;
		const position = polygon.position;
		var bounds = {
			minX: position.x + polygonBounds.minX,
			minY: position.y + polygonBounds.minY,
			maxX: position.x + polygonBounds.maxX,
			maxY: position.y + polygonBounds.maxY
		}
		var minX =-width/2,
			maxX = width/2,
			minY =-height/2,
			maxY = height/2;

		var normal = {x:0, y:0}, depth = 0, isCollide = false;
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
		return [isCollide, normal, depth]
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
	isCollide(polygon1, polygon2){
		return this.polygonPolygon(polygon1, polygon2);
	}
	//check for collision between polygons by
	//pick a polygon that has the smallest vertices number
	//and loop through all the vertices of the other polygon
	//and check if the point is inside the polygon using ray casting
	polygonPolygon(polygon1, polygon2){
		var i;
		var isCollide=false,
			normal={x:0,y:0},
			depth=0;

		for(i=0; i<polygon1.vertices.length; i++){
			[isCollide,normal,depth]= this.pointPolygon({
				x: polygon1.vertices[i].x + polygon1.position.x,
				y: polygon1.vertices[i].y + polygon1.position.y
			}, polygon2);
			if(isCollide) return [isCollide, normal, depth];
		}
		for(i=0; i<polygon2.vertices.length; i++){
			[isCollide,normal,depth]= this.pointPolygon({
				x: polygon2.vertices[i].x + polygon2.position.x,
				y: polygon2.vertices[i].y + polygon2.position.y
			}, polygon1);
			if(isCollide) return [isCollide,{x:-normal.x, y:-normal.y}, depth];
		}

		return [false,null,null];
	}
	circlePolygon(circle, polygon){
		var i,
			isCollide=false,
			normal={x:0,y:0},
			depth=0;

		const vertices = polygon.vertices;
		for(i=0; i<vertices.length; i++){
			[isCollide,normal,depth]= this.pointCircle({
				x: vertices[i].x + polygon.position.x,
				y: vertices[i].y + polygon.position.y
			}, circle);
			if(isCollide) return [isCollide,normal,depth];
		}

		return [false,null,null];
	}
	circleCircle(circle1, circle2){
		var normal={x:0,y:0},
			depth=0;

		var distance = Math.sqrt(
			Math.pow(circle1.position.x - circle2.position.x, 2) +
			Math.pow(circle1.position.y - circle2.position.y, 2)
		);

		if(distance < circle1.radius + circle2.radius){
			depth = circle1.radius + circle2.radius - distance;
			normal = {
				x: (circle1.position.x - circle2.position.x)/distance,
				y: (circle1.position.y - circle2.position.y)/distance
			}
			return [true, normal, depth];
		}
		return [false,null,null]
	}

	pointCircle(point, circle){
		var normal={x:0,y:0},
			depth=0;

		var distance = Math.sqrt(
			Math.pow(point.x - circle.position.x, 2) + 
			Math.pow(point.y - circle.position.y, 2)
		);

		if(distance < circle.radius){
			depth = circle.radius - distance;
			normal = {
				x: (point.x - circle.position.x)/distance,
				y: (point.y - circle.position.y)/distance
			}
			return [true,normal,depth];
		}
		return [false, null, null]
	}
	//using ray casting from the point to the very right
	//if the point is inside the polygon the number of intersections is odd
	//if the point is outside the polygon the number of intersections is even
	pointPolygon(point, polygon){
		var i;
		var intersect = 0;
		const vertices = polygon.vertices;
		const p = { x: point.x, y: point.y };

		var normal={x: 0, y: 0},
			depth=0;
		var old_distance = Infinity;

		for(i=0; i<vertices.length; i++){
			const next = vertices[i+1] || vertices[0]; 

			const a = { x: vertices[i].x + polygon.position.x,
				y: vertices[i].y + polygon.position.y }
			const b = { x: next.x + polygon.position.x,
				y: next.y + polygon.position.y }

			//find closest point from the point to edge
			var abx = b.x - a.x + 1e-8,
				aby = b.y - a.y + 1e-8;
			var ab_distance = Math.sqrt(abx*abx + aby*aby);

			const distance = Math.abs(
				aby*p.x - abx*p.y + b.x*a.y-b.y*a.x
			) / ab_distance;

			//get x value from segment a and b by knowing y from p.y
			const x = (p.y - a.y) * (b.x - a.x) / (b.y - a.y) + a.x;

			if(distance < old_distance){
				depth = distance;
				if(p.x>x)
					normal = {x:-aby/ab_distance,y:abx/ab_distance}
				else 
					normal = {x:aby/ab_distance,y:-abx/ab_distance}
				old_distance = distance;
			}

			if(p.y > Math.min(a.y, b.y) && p.y < Math.max(a.y, b.y) ){
				if(p.x > Math.max(a.x, b.x)) continue;
				if(x > p.x) intersect++;
			}else continue;
		}
		return intersect % 2 === 1 ? [true,normal,depth] : [false,null,null];
	}	
}
