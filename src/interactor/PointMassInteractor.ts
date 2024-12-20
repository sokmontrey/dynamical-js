import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/Vector.ts";
import Interactor from "./Interactor";

export default class PointMassInteractor extends Interactor {
	protected pointmass: PointMass;

	constructor(pointmass: PointMass) {
		super();
		this.pointmass = pointmass;
	}

    isSelected(lower: Vec2, upper: Vec2): boolean {
		const pm_pos = this.pointmass.getPosition();
		return pm_pos.isInBoundingBox(lower, upper);
    }

	/**
	* Check if a point is hovering the pointmass 
	* by checking against the body-renderer's radius.
	* Return false if position body-renderer is disabled
	**/
    isHovered(pos: Vec2): boolean {
		const pm = this.pointmass;
		const renderer = pm.renderer;
		const pm_pos = pm.getPosition();
		const radius = renderer.position.radius;
		return pos.distance(pm_pos) <= radius * 1.5
			&& renderer.position.is_enable;
    }
}
