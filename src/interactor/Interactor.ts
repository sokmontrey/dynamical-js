import Vec2 from "../utils/Vector.ts";

export default abstract class Interactor {
	private is_locked: boolean = false;

	/**
	* Check whether a point (x, y) is inside the body
	* Doesn't affected by the locked state. Please use isLocked explicitly.
	**/
	abstract isHovered(pos: Vec2): boolean;

	/**
	* Check whether the body is inside a selected area. 
	* Doesn't affected by the locked state. Please use isLocked explicitly.
	* @param lower: top-left corner position of the selected rectangle
	* @param lower: bottom-right corner position of the selected rectangle
	**/
	abstract isSelected(lower: Vec2, upper: Vec2): boolean;

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
