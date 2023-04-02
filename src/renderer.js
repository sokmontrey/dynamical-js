import {Vector2} from './util/dynamical-vector.js';

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

	point({x, y}, radius=3,
		{ 
			fill=null, 
			stroke=null, 
			stroke_width=null, 
		}={}
	){
		this._context.beginPath();
		this._context.arc(x, y, radius, 0, Math.PI * 2);
		this._context.closePath();

		if(fill) this._context.fillStyle = fill; 
		this._context.fill();

		if(stroke_width) {
			stroke ? this._context.strokeStyle = stroke : null;
			this._context.lineWidth = stroke_width;
			this._context.stroke();
		}
	}

	line({x: x1, y: y1}, {x: x2, y: y2}, thickness=2,
		{
			stroke=null, 
		}={}
	){
		this._context.beginPath();
		this._context.moveTo(x1, y1);
		this._context.lineTo(x2, y2);
		this._context.closePath();

		stroke ? this._context.strokeStyle = stroke : null;
		this._context.lineWidth = thickness;
		this._context.stroke();
	}

	polygon(points, 
		{
			fill=null, 
			stroke=null, 
			stroke_width=null, 
		}={}
	){
		this._context.beginPath();
		this._context.moveTo(points[0].position.x, points[0].position.y);
		for(let i=1; i<points.length; i++){
			this._context.lineTo(points[i].position.x, points[i].position.y);
		}
		this._context.lineTo(points[0].position.x, points[0].position.y);
		this._context.closePath();

		if(fill) this._context.fillStyle = fill; 
		this._context.fill();

		if(stroke_width) {
			stroke ? this._context.strokeStyle = stroke : null;
			this._context.lineWidth = stroke_width;
			this._context.stroke();
		}
	}

	update(func=null){
		if(!this._update_function){
			this._update_function = func;
			requestAnimationFrame(this._animate);
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
		return new Vector2(this._width/2.0, this._height/2.0);
	}
	get RANDOM(){
		return new Vector2(
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