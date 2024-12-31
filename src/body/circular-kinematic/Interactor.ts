import BodyInteractor from "@/core/BodyInteractor";
import Vec2 from "@/utils/Vector";
import CircularKinematic from "./Body";

export default class CircularKinematic_Interactor extends BodyInteractor {
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