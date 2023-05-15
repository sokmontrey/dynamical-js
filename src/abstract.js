export default class Abstract{
    constructor(){
        this.name       = null;

        this.graphic    = {
            renderer: null,

            is_fill: 'true',
            fill_style: 'white',
            
            is_stroke: false,
            stroke_style: 'gray',
            line_width: 2,

            applyStyle: (shape)=>{
                if(this.graphic.is_fill) {
                    shape.setFillStyle(this.graphic.fill_style)
                    .fill();
                }

                if(this.graphic.is_stroke) {
                    shape.setLineWidth(this.graphic.line_width)
                        .setStrokeStyle(this.graphic.stroke_style)
                        .stroke();
                }
            }
        }
    }

    setRenderer(renderer){
        this.graphic.renderer = renderer;
    }
}
