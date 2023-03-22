import {Vector2} from './util/vector.js';

export default class Renderer{

	constructor(canvas, width=500, height=500){
		this.canvas = canvas;
		this.c = canvas.getContext('2d');
		this.width = width;
		this.height = height;

		/* color */
		this.color_palette = [];
		this.background_color = 'white';

		this.resize(width, height);
		this.clear();

		this.update_function;
		this.last_time = 0;
		this._animate = this._animate.bind(this);
	}

	usePalette(color_palette=['#ff0000', '#00ff00', '#0000ff']){
		this.color_palette = color_palette;
	}

	resize(width, height){
		this.width = width;
		this.height = height;
		this.c.canvas.width = width;
		this.c.canvas.height = height;
		this.clear();
	}

	setBackground(background_color='white'){
		this.background_color = background_color;
		this.clear();
	}

	clear(){
		this.c.beginPath();
		this.c.fillStyle = this.background_color;
		this.c.fillRect(0,0, this.width, this.height);
	}

	point({x, y}, radius=3,
		{ 
			fill=null, 
			stroke=null, 
			stroke_width=null, 
		}={}
	){
		this.c.beginPath();
		this.c.arc(x, y, radius, 0, Math.PI * 2);

		if(fill) this.c.fillStyle = fill; 
		this.c.fill();

		if(stroke_width) {
			stroke ? this.c.strokeStyle = stroke : null;
			this.c.lineWidth = stroke_width;
			this.c.stroke();
		}
	}

	line({x, y}, thickness=2,
		{
			fill=null, 
			stroke=null, 
			stroke_width=null, 
		}
	){

	}

	update(func=null){
		if(!this.update_function){
			this.update_function = func;
			requestAnimationFrame(this._animate);
		}
	}

	_animate(current_time) {
		const delta_time = Math.min(current_time - this.last_time, 1000/30.0);
		this.last_time = current_time;

		if(this.update_function) {
			this.update_function({
				'delta_time': delta_time,
				'context': this.c,
			});
		}
		requestAnimationFrame(this._animate);
	}

	get CENTER(){
		return new Vector2(this.width/2.0, this.height/2.0);
	}
	get RANDOM(){
		return new Vector2(
			Math.random() * this.width, 
			Math.random() * this.height 
		);
	}
	get HEIGHT(){
		return this.height;
	}
	get WIDTH(){
		return this.width;
	}
}