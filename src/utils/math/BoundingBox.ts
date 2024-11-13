import Point from "../../quadtree/Point";
import Vec2 from "./Vector";

export default class BoundingBox {
	public readonly center: Vec2;
	public readonly half_dim: Vec2;

	/**
	* @params half_dim Vec2(width / 2, height / 2)
	**/
	constructor(center: Vec2, half_dim: Vec2) {
		this.center = center;
		this.half_dim = half_dim;
	}

	/**
	* Inclusive to upper bound
	**/
	isContainsPoint<T>(point: Point<T>) {
		const pos = point.pos;
		return this.isContainsVec2(pos);
	}

	// TODO: Use this class for Interactor bounding box
	isContainsVec2(pos: Vec2) {
		const lower = this.getLower();
		const upper = this.getUpper();
		return !(pos.x > upper.x
			|| pos.y > upper.y
			|| pos.x <= lower.x
			|| pos.y <= lower.y);
	}

	isIntersectsBondingBox(other: BoundingBox) {
		return !(this.getUpper().x < other.getLower().x
			|| this.getUpper().y < other.getLower().y
			|| this.getLower().x >= other.getUpper().x
			|| this.getLower().y >= other.getUpper().y);
	}

	getLower() {
		return this.center.sub(this.half_dim);
	}

	getUpper() {
		return this.center.add(this.half_dim);
	}

	/**
	* @params dim Vec2(width, height)
	**/
	static fromUpperAndLower(upper: Vec2, lower: Vec2) {
		return new BoundingBox(
			lower.add(upper).div(2.0),
			upper.sub(lower).div(2.0).abs());
	}
}
