import Vec2 from "../utils/math/Vector";

export default abstract class Interactor {
	private is_locked: boolean = false;

	abstract isBoundingBoxContainsPoint(pos: Vec2): boolean;
	abstract isContainsPoint(pos: Vec2): boolean;

	//================================ Setters ================================

	lock() {
		this.is_locked = true;
		return this;
	}

	unlock() {
		this.is_locked = false;
		return this;
	}

	//================================ Getters ================================

	isLocked() {
		return this.is_locked;
	}
}
