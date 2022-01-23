class Collision{
	constructor(){}

	pointPolygon(point, polygon){
		var i;
		var intersect = 0;
		const vertices = polygon.vertices;

		const p = {
			x: point.x, 
			y: point.y
		};

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

			if(p.y > Math.min(a.y, b.y) && p.y < Math.max(a.y, b.y) ){
				if(p.x > Math.max(a.x, b.x)) continue;

				//get x value from segment a and b by knowing by from p.y
				const x = (p.y - a.y) * (b.x - a.x) / (b.y - a.y) + a.x;
				if(x > p.x) intersect++;
			}else continue;
		}
		return intersect % 2 === 1;
	}	
}
