import BoundingBox from "../utils/math/BoundingBox";
import Point from "./Point";

export interface QuadtreeParams {
	capacity?: number;
}

export default class Quadtree<T> {
	private readonly capacity: number;
	private bound_box: BoundingBox;
	private points: Point<T>[];

	/**
	* Four Quadrants
	* Q1 | Q2
	* --------
	* Q3 | Q4
	**/
	private Q1?: Quadtree<T> | null = null;
	private Q2?: Quadtree<T> | null = null;
	private Q3?: Quadtree<T> | null = null;
	private Q4?: Quadtree<T> | null = null;

	constructor(bounding_box: BoundingBox, {
		capacity = 5,
	}: QuadtreeParams = {}) {
		this.bound_box = bounding_box;
		this.capacity = capacity;
		this.points = [];
	}

	insert(point: Point<T>) {

	}

	subdivide() {

	}

	queryRange(range: BoundingBox) {

	}
}
