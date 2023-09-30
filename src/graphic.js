export class Graphic{
    constructor(){
        this.renderer = null;

        this.is_fill = 'true';
        this.fill_style = 'white';
        
        this.is_stroke = false;
        this.stroke_style = 'gray';
        this.line_width = 2;
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