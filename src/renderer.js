import { Vector} from "./util/dynamical_vector.js";
export default class Renderer{

	constructor(canvas, width=500, height=500){
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		this._width = width;
		this._height = height;

		/* color */
		this._background_color = 'white';

		this.resize(width, height);
		this.clear();

		this._update_function;
		this._last_time = 0;
		this._animate = this._animate.bind(this);
	}

	resize(width, height){
		this._width = width;
		this._height = height;
		this._context.canvas.width = width;
		this._context.canvas.height = height;
		this.clear();
	}

	setBackground(background_color='white'){
		this._background_color = background_color;
		this.clear();
	}

	clear(){
		this._context.beginPath();
		this._context.fillStyle = this._background_color;
		this._context.fillRect(0,0, this._width, this._height);
	}

	circle({ 
        position=new Vector(0,0),
        radius=3,

        fill=null, 
        stroke=null, 
        line_width=null, 
    }){
        const x = position.x,
            y = position.y;

		this._context.beginPath();
		this._context.arc(x, y, radius, 0, Math.PI * 2);
		this._context.closePath();

        this._styleContext(fill, stroke, line_width);
	}

	line({
        start=new Vector(0,0),
        end=new Vector(50,50),

        fill=null,
        stroke=null,
        line_width=2
    }){
        const 
            x1 = start.x,
            y1 = start.y,
            x2 = end.x,
            y2 = end.y;

		this._context.beginPath();
		this._context.moveTo(x1, y1);
		this._context.lineTo(x2, y2);
		this._context.closePath();

        this._styleContext(fill, stroke, line_width);
	}

	polygon({
        points=[],

        fill=null, 
        stroke=null, 
        line_width=null, 
    }){
		this._context.beginPath();
		this._context.moveTo(points[0].x, points[0].y);
		for(let i=1; i<points.length; i++){
			this._context.lineTo(points[i].x, points[i].y);
		}
		this._context.lineTo(points[0].x, points[0].y);
		this._context.closePath();

        this._styleContext(fill, stroke, line_width);
	}

    fill(){
        this._context.fill();
        return this;
    }
    stroke(){
        this._context.stroke();
        return this;
    }
    setLineWidth(line_width=3){
        this._context.lineWidth = line_width;
        return this;
    }
    setStrokeStyle(color='gray'){
        this._context.strokeStyle = color;
        return this;
    }
    setFillStyle(color='white'){
        this._context.fillStyle = color;
        return this;
    }

	update(func=null){
		if(!this._update_function){
			this._update_function = func;
			requestAnimationFrame(this._animate);
		}
	}

    _styleContext(fill, stroke, line_width){
		if(fill) this._context.fillStyle = fill; 
		this._context.fill();

		if(line_width) {
			stroke ? this._context.strokeStyle = stroke : null;
			this._context.lineWidth = line_width;
            this._context.stroke();
		}
    }

	_animate(current_time) {
		const delta_time = Math.min(current_time - this._last_time, 1000/30.0) * 0.01;
		this._last_time = current_time;

		if(this._update_function) {
			this._update_function({
				'delta_time': delta_time,
				'context': this._context,
			});
		}
		requestAnimationFrame(this._animate);
	}

	get context(){ return this._context; }

	get CENTER(){
		return new Vector(this._width/2.0, this._height/2.0);
	}
	get RANDOM(){
		return new Vector(
			Math.random() * this._width, 
			Math.random() * this._height 
		);
	}
	get HEIGHT(){
		return this._height;
	}
	get WIDTH(){
		return this._width;
	}
}
