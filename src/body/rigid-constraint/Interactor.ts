import BodyInteractor from "@/core/BodyInteractor";
import { segment } from "@/utils/Segment";
import Vec2, { vec2 } from "@/utils/Vector";
import RigidConstraint from "./Body";

export default class RigidConstraint_Interactor extends BodyInteractor {
	protected rigid_constraint: RigidConstraint;

	constructor(rigid_constraint: RigidConstraint) {
		super();
		this.rigid_constraint = rigid_constraint;
	}

	/**
	* Check whether a selected area touches the line
	**/
    isSelected(lower: Vec2, upper: Vec2): boolean {
		const [pm1, pm2] = this.rigid_constraint.getPointMasses(); 
		const pos1 = pm1.getPosition();
		const pos2 = pm2.getPosition();

		// 1. if both or one pointmass is in the selected area
		if (pos1.isInBoundingBox(lower, upper) || 
			pos2.isInBoundingBox(lower, upper)) return true;

		// 2. if both pointmass is out of the selected area
		const segments = [
			segment(lower, vec2(upper.x, lower.y)),
			segment(vec2(upper.x, lower.y), upper),
			segment(upper, vec2(lower.x, upper.y)),
			segment(vec2(lower.x, upper.y), lower),
		];
		const line_segment = segment(pos1, pos2);
		for(const segment of segments) 
			if (segment.isIntersect(line_segment)) return true;

		return false;
    }

    isHovered(pos: Vec2): boolean {
		const renderer = this.rigid_constraint.renderer;
		if (!renderer.constraint_line.is_enable) return false;
		const line_width = renderer.constraint_line.line_width;
		const [pm1, pm2] = this.rigid_constraint.getPointMasses();
		const distance_to_point = segment(
			pm1.getPosition(), 
			pm2.getPosition()
		).distanceToPoint(pos);
		return distance_to_point <= line_width * 2;
    }
}
