export default class Resolver{
	resolve(body1, body2, normal, depth){
		this._manifold(body1, {
			x: normal.x, 
			y: normal.y
		}, depth/2);

		this._manifold(body2, {
			x: -normal.x,
			y: -normal.y
		}, depth/2);

		this._velocity(body1, body2, normal, depth);
	}
	resolveBorder(body, normal, depth){
		this._manifold(body, normal, depth);
	}
	_velocity(body1, body2, normal, depth){
		//TODO:
		const dynamic1 = body1.dynamic;
		const dynamic2 = body2.dynamic;

		const v1 = {
			x: dynamic1.velocity.x,
			y: dynamic1.velocity.y
		};
		const v2 = {
			x: dynamic2.velocity.x,
			y: dynamic2.velocity.y
		};
		let m1 = body1.mass,
			m2 = body2.mass;
		const sumMass = m1 + m2;

		dynamic1.velocity.x = v1.x - (2*m2)/(sumMass) * normal.x * depth;
		dynamic1.velocity.y = v1.y - (2*m2)/(sumMass) * normal.y * depth;
		dynamic2.velocity.x = v2.x + (2*m1)/(sumMass) * normal.x * depth;
		dynamic2.velocity.y = v2.y + (2*m1)/(sumMass) * normal.y * depth;
	}
	_manifold(body, normal, depth){
		body.position.x += normal.x * depth;
		body.position.y += normal.y * depth;
		
		body.dynamic.velocity = {x:0, y:0};
	}
}
