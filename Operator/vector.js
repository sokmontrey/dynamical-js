export default class Vector{
	crossProduct(vectorA, vectorB){
		return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
	}
	dotProduct(vectorA, vectorB){
		return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
	}
	distance(vectorA, vectorB){
		return Math.sqrt(Math.pow(vectorA.x - vectorB.x, 2) + Math.pow(vectorA.y - vectorB.y, 2));
	}
	sqrtLength(vector){
		return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	}
}
