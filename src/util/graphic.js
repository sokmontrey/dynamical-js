export default class Graphic {
  constructor(fill_color, stroke_color){
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.stroke_width = 1;
    this.is_fill = true;
    this.is_stroke = false;
  }
  setFillColor(color) {
    this.fill_color = color;
    return this;
  }
  setStrokeColor(color) {
    this.stroke_color = color;
    return this;
  }
  setStrokeWidth(width) {
    this.stroke_width = width;
    return this;
  }
}
