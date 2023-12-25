import Graphic from "../util/graphic.js";

export default class Constraint {
  constructor (stiffness=1, breaking_threshold=0, is_disabled=false) {
    this.stiffness = stiffness;
    this.breaking_threshold = breaking_threshold;
    this.is_disabled = is_disabled;
    this.graphic = new Graphic("black", "gray");
  }

  _checkBreakingThreshold(value) {
    if (this.breaking_threshold > 0 && value> this.breaking_threshold) {
      this.disable();
      return true;
    }
    return false;
  }

  enable(is_cal_new_value = false) {
    this.is_disabled = false;
    this.graphic.show();
    if (is_cal_new_value) {
      this._calculateConstraintValue();
    }
    return this;
  }

  disable() {
    this.is_disabled = true;
    this.graphic.hide();
    return this;
  }

  setBreakingThreshold(threshold) {
    if (threshold < 0) {
      throw new Error("DistanceConstraint.setBreakingThreshold: threshold < 0");
    }
    this.breaking_threshold = threshold;
    return this;
  }

  noBreaking() {
    this.breaking_threshold = 0;
    return this;
  }
}
