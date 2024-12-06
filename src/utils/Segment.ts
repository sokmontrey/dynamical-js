import Vec2 from "./Vector.ts";

export const segment = (a: Vec2, b: Vec2) => new Segment(a, b);

export default class Segment {
	public readonly a: Vec2;
	public readonly b: Vec2;
	public readonly slope: number | null;

	constructor(a: Vec2, b: Vec2) {
		this.a = a;
		this.b = b;
		if (a.y === b.y) this.slope = null;
		else this.slope = (b.y - a.y) / (b.x - a.x);
	}

	getIntersect(other: Segment): Vec2 | null {
		if (this.slope === other.slope) return null;

		let x: number, y: number;

		if (this.slope === null) { // If this segment is vertical
			x = this.a.x;
			y = other.slope * (x - other.a.x) + other.a.y;
		} else if (other.slope === null) {// If the other segment is vertical
			x = other.a.x;
			y = this.slope * (x - this.a.x) + this.a.y;
		} else {
			x = (other.a.y - this.a.y + this.slope * this.a.x - other.slope * other.a.x) /
				(this.slope - other.slope);
			y = this.slope * (x - this.a.x) + this.a.y;
		}

		if (this.isWithinBounds(x, y) && other.isWithinBounds(x, y)) return new Vec2(x, y);
		return null;
	}

    isIntersect(line_segment: Segment) {
		return this.getIntersect(line_segment) !== null;
    }

	//================================ With Vector ================================
	
	distanceToPoint(point: Vec2) {
		const ab = this.b.sub(this.a);
		const ap = point.sub(this.a);
		// project vector ap onto ab, get the projection factor t
		const ab_squared = ab.dot(ab);
		const t = ab_squared === 0 ? 0 : ap.dot(ab) / ab_squared;
		// clamp t to be within the segment range [0, 1]
		const clamped_t = Math.max(0, Math.min(1, t));
		// find the closest point on the segment to the point
		const closest_point = this.a.add(ab.mul(clamped_t));
		// calculate the distance between the closest point and the point
		return point.distance(closest_point);
	}

	private isWithinBounds(x: number, y: number): boolean {
		return (
			Math.min(this.a.x, this.b.x) <= x && x <= Math.max(this.a.x, this.b.x) &&
			Math.min(this.a.y, this.b.y) <= y && y <= Math.max(this.a.y, this.b.y)
		);
	}
}
