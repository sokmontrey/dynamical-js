import Vec2 from "../utils/math/Vector";

export default abstract class Interactor {
	private is_locked: boolean = false;

	/**
	* Check whether a point (x, y) is inside the body
	**/
	abstract isHovered(pos: Vec2): boolean;

	/**
	* Check whether a point (x, y) is inside the bounding box of the body.
	* Used as a pre-check before performing any costly operation for precise checking
	**/
	abstract isBoundingBoxHovered(pos: Vec2): boolean;

	/**
	* Check whether the body is inside a selected area
	* @param start: top-left corner position of the selected rectangle
	* @param start: bottom-right corner position of the selected rectangle
	**/
	abstract isSelected(start: Vec2, end: Vec2): boolean;

	//================================ Setters ================================

	/**
	* Turn the body into a locked state, unable to be selected
	**/
	lock() {
		this.is_locked = true;
		return this;
	}

	/**
	* Turn the body back into the selectable state
	**/
	unlock() {
		this.is_locked = false;
		return this;
	}

	//================================ Getters ================================

	/**
	* Is the body selectable
	**/
	isLocked() {
		return this.is_locked;
	}
}
