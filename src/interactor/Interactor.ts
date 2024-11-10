import Vec2 from "../utils/math/Vector";

export default interface Interactor {
	isBoundingBoxContainsPoint(pos: Vec2): boolean;
	isContainsPoint(pos: Vec2): boolean;
}
