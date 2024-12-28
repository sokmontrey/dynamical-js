import BodyInteractor from "../../core/BodyInteractor";
import Vec2 from "../../utils/Vector";
import PointMass from "./Body";

export default class PointMass_Interactor extends BodyInteractor {
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
