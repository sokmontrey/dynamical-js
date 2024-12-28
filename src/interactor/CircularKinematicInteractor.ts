import CircularKinematic from "../core-physic/CircularKinematic";
import Vec2 from "../utils/Vector.ts";
import Interactor from "./Interactor";

export default class CircularKinematicInteractor extends Interactor {
	protected circular_kinematic: CircularKinematic;

	constructor(circular_kinematic: CircularKinematic) {
		super();
		this.circular_kinematic = circular_kinematic;
	}

    isSelected(lower: Vec2, upper: Vec2): boolean {
		const center = this.circular_kinematic.getPosition();
		return center.isInBoundingBox(lower, upper);
    }

	/**
	* Check if a point is hovering over the stroke of the circular kinematic
	**/
    isHovered(pos: Vec2): boolean {
		const center = this.circular_kinematic.getPosition();
		const radius = this.circular_kinematic.getRadius();
		const distance = pos.distance(center);
		return distance >= radius - 10 && distance <= radius + 10;
    }
}