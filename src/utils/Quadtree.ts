import PointMass from "../core-physic/PointMass.ts";
import BoundingBox from "./BoundingBox.ts";
import Vec2, { vec2 } from "./Vector.ts";

export interface QuadtreeParams {
	capacity?: number;
}

/**
* Basic implementation follow Wikipedia pseudo code
* https://www.wikiwand.com/en/articles/Quadtree#Pseudocode
* TODO: deal with point radius
**/
export default class Quadtree {
	private readonly capacity: number;
	private bound_box: BoundingBox;
	private pointmasses: PointMass[];

	/**
	* Four Quadrants
	* Q1 | Q2
	* --------
	* Q3 | Q4
	**/
	private Q1?: Quadtree | null = null;
	private Q2?: Quadtree | null = null;
	private Q3?: Quadtree | null = null;
	private Q4?: Quadtree | null = null;

	constructor(center: Vec2, half_dim: Vec2, {
		capacity = 5,
	}: QuadtreeParams = {}) {
		this.bound_box = new BoundingBox(center, half_dim);
		this.capacity = capacity;
		this.pointmasses = [];
	}

	insert(pointmass: PointMass) {
		if (!this.bound_box.isContainsVec2(pointmass.getPosition())) return false;
		if (this.pointmasses.length < this.capacity && this.Q1 === null) {
			this.pointmasses.push(pointmass);
			return true;
		}
		if (!this.isSubdivided()) this.subdivide();

		if (this.Q1?.insert(pointmass)) return true;
		if (this.Q2?.insert(pointmass)) return true;
		if (this.Q3?.insert(pointmass)) return true;
		if (this.Q4?.insert(pointmass)) return true;
		return false;
	}

	subdivide() {
		const center = this.bound_box.center;
		// new half width and half height for the sub quadtree
		const sub_half = this.bound_box.half_dim.div(2.0);
		this.Q1 = new Quadtree(center.sub(sub_half), sub_half);
		this.Q2 = new Quadtree(center.add(vec2(sub_half.x, -sub_half.y)), sub_half);
		this.Q3 = new Quadtree(center.add(sub_half), sub_half);
		this.Q4 = new Quadtree(center.add(vec2(-sub_half.x, sub_half.y)), sub_half);
	}

	queryRange(range: BoundingBox, result: PointMass[] = []) {
		if (!this.bound_box.isIntersectsBondingBox(range)) return result;
		for (const point of this.pointmasses) if (range.isContainsPoint(point)) result.push(point);

		if (!this.isSubdivided()) return result;

		this.Q1?.queryRange(range, result);
		this.Q2?.queryRange(range, result);
		this.Q3?.queryRange(range, result);
		this.Q4?.queryRange(range, result);
		return result;
	}

	query(pos: Vec2, _result: PointMass[] = []) {
		if (!this.bound_box.isContainsVec2(pos)) return _result;
		for (const point of this.pointmasses) {
			if (point.interactor.isHovered(pos)) {
				_result.push(point);
			}
		}

		if (!this.isSubdivided()) return _result;

		this.Q1?.query(pos, _result);
		this.Q2?.query(pos, _result);
		this.Q3?.query(pos, _result);
		this.Q4?.query(pos, _result);
		return _result;
	}

	//================================ Getters ================================

	getCenter() {
		return this.bound_box.center;
	}

	getHalfDim() {
		return this.bound_box.half_dim;
	}

	getDim() {
		return this.bound_box.getDim();
	}

	getLower() {
		return this.bound_box.getLower();
	}

	getUpper() {
		return this.bound_box.getUpper();
	}

	isSubdivided() {
		return this.Q1 !== null;
	}

	getSubQuads() {
		return [this.Q1, this.Q2, this.Q3, this.Q4];
	}

	getPointMasses() {
		return this.pointmasses;
	}

	isContains(pos: Vec2) {
		return this.bound_box.isContainsVec2(pos);
	}
}
