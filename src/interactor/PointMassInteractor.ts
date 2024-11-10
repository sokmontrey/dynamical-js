import PointMass from "../core-physic/PointMass";
import Vec2 from "../utils/math/Vector";
import Interactor from "./Interactor";

export default class PointMassInteractor extends Interactor {
	protected pointmass: PointMass;

	constructor(pointmass: PointMass) {
		super();
		this.pointmass = pointmass;
	}

    isBoundingBoxContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }

    isContainsPoint(pos: Vec2): boolean {
        throw new Error("Method not implemented.");
    }
}
