export class Graphic{
    constructor(){
        this.is_fill                = true;
        this.fill_color             = 'white';
        
        this.is_stroke              = false;
        this.stroke_color           = 'gray';
        this.stroke_width           = 2;

        this.is_wireframe           = false;
        this.wireframe_color        = 'blue';
        this.wireframe_width        = 2;

        this.radius                 = 5;
    }

    fill(fill_color='white'){
        this.is_fill = true;
        this.fill_color = fill_color;
        return this;
    }

    stroke(stroke_color='gray'){
        this.is_stroke = true;
        this.stroke_color = stroke_color;
        return this;
    }

    wireframe(wireframe_color='blue', wireframe_width=2){
        this.is_wireframe = true;
        this.wireframe_width = wireframe_width;
        this.wireframe_color = wireframe_color;
        return this;
    }

    noStroke(){
        this.is_stroke = false;
        return this;
    }

    noFill(){
        this.is_fill = false;
        return this;
    }

    applyStyle(shape){
        if(this.is_fill) {
            shape.setFillStyle(this.fill_style)
            .fill();
        }

        if(this.is_stroke) {
            shape.setLineWidth(this.line_width)
                .setStrokeStyle(this.stroke_style)
                .stroke();
        }
    }
}
