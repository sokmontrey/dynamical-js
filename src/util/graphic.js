export default class Graphic {
  constructor(fill_color, stroke_color){
    this.fill_color = fill_color;
    this.stroke_color = stroke_color;
    this.stroke_width = 1;
    this.is_fill = true;
    this.is_stroke = false;
  }

  noFill() {
    this.is_fill = false;
    return this;
  }
  noStroke(){
    this.is_stroke = false;
    return this;
  }

  fill(){
    this.is_fill = true;
    return this;
  }
  stroke(){
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
