import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/math/Vector";
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

    isBoundingBoxHovered(pos: Vec2): boolean {
		const [lower, upper] = this.pointmass.renderer.getBoundingBox();
		return pos.isInBoundingBox(lower, upper);
    }

	/**
	* Check if a point is hovering the pointmass 
	* by checking against the renderer's radius.
	* Return false if position renderer is disabled
	**/
    isHovered(pos: Vec2): boolean {
		const pm = this.pointmass;
		const renderer = pm.renderer;
		const pm_pos = pm.getPosition();
		const radius = renderer.position.getRadius();
		return pos.distance(pm_pos) <= radius 
			&& renderer.position.isEnable();
    }
}
