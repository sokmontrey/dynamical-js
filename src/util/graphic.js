export default class Graphic {
  constructor(fill_color, stroke_color) {
    this.size = 5;
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.stroke_width = 1;
    this.is_fill = true;
    this.is_stroke = false;
    this.is_visible = true;
    this.draw = () => {};
  }

  setSize(size) {
    this.size = size;
    return this;
  }
  getSize() {
    return this.size;
  }

  isVisible() {
    return this.is_visible;
  }
  show() {
    this.is_visible = true;
    return this;
  }
  hide() {
    this.is_visible = false;
    return this;
  }

  noFill() {
    this.is_fill = false;
    return this;
  }
  noStroke() {
    this.is_stroke = false;
    return this;
  }

  fill() {
    this.is_fill = true;
    return this;
  }
  stroke() {
    this.is_stroke = true;
    return this;
  }

  setFillColor(color) {
    this.is_fill = true;
    this.fill_color = color;
    return this;
  }
  setStrokeColor(color) {
    this.is_stroke = true;
    this.stroke_color = color;
    return this;
  }
  setStrokeWidth(width) {
    this.is_stroke = true;
    this.stroke_width = width;
    return this;
  }
}

export class ShapeGraphic extends Graphic {
  constructor(fill_color, stroke_color) {
    super(fill_color, stroke_color);

    this.is_vertices = false;
    this.is_joints = false;
    this.is_distance_constraints = false;
    this.is_center_of_mass = false;
    this.center_of_mass_color = "#ff0000";
    this.is_bounding_box = false;
    this.bounding_box_color = "#00ff00";
  }

  boundingBox(color = this.bounding_box_color) {
    this.bounding_box_color = color;
    this.is_bounding_box = true;
    return this;
  }
  noBoundingBox() {
    this.is_bounding_box = false;
    return this;
  }

  distanceConstraints() {
    this.is_distance_constraints = true;
    return this;
  }
  noDistanceConstraints() {
    this.is_distance_constraints = false;
    return this;
  }

  centerOfMass(color = this.center_of_mass_color) {
    this.center_of_mass_color = color;
    this.is_center_of_mass = true;
    return this;
  }
  noCenterOfMass() {
    this.is_center_of_mass = false;
    return this;
  }

  wireframe() {
    this.noFill();
    this.stroke();
    return this;
  }
  noWireframe() {
    this.fill();
    this.noStroke();
    return this;
  }

  vertices() {
    this.is_vertices = true;
    return this;
  }
  noVertices() {
    this.is_vertices = false;
    return this;
  }

  joints() {
    this.is_joints = true;
    return this;
  }
  noJoints() {
    this.is_joints = false;
    return this;
  }
}
