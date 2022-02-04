export default class Vertex{
	//rotate by angle
	//TODO: implement rotate to angle
	rotate(vertices, angle){
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);
		for(let i = 0; i < vertices.length; i++){
			let x = vertices[i].x;
			let y = vertices[i].y;
			vertices[i].x = x * cos - y * sin;
			vertices[i].y = x * sin + y * cos;
		}
		return vertices;
	}
	min(vertices, axis){
		let min = vertices[0][axis];
		for(let i = 1; i < vertices.length; i++){
			min = Math.min(min, vertices[i][axis]);
		}
		return min;
	}
	max(vertices, axis){
		let max = vertices[0][axis];
		for(let i = 1; i < vertices.length; i++){
			max = Math.max(max, vertices[i][axis]);
		}
		return max;
	}
}

