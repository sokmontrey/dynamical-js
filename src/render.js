export default class Renderer{

	constructor(canvas, width=400, height=400){
		this.canvas = canvas;
		this.c = canvas.getContext('2d');
		this.background_color = '#000000';
		this.fill_color = '#ffffff';
		this.stroke_color = '#aaaaff';

		this.update_function = undefined;
		this.last_time = 0;
		this._animate = this._animate.bind(this);

		this.resize(width, height);
		this.clear();
	}

	resize(width, height){
		this.c.canvas.width = width;
		this.c.canvas.height = height;
	}

	/*----color----*/
	setBackground(new_color){
		this.background_color = new_color;
		this.clear();
	}
	setFill(new_fill){
		this.c.fillStyle = new_fill;
	}
	//TODO: check this
	setStroke(new_stroke){
		this.c.strokeStyle = new_stroke;
	}

	clear(){
		this.c.fillStyle = this.background_color;
		this.c.fillRect(0,0,this.canvas.width, this.canvas.height);
	}

	point(x, y, size=3){
		this.c.beginPath();
		this.c.arc(x,y,size,0, 2*Math.PI);
		this.c.fill();
	}

	_animate(current_time) {
		const delta_time = current_time - this.last_time;
		this.last_time = current_time;

		if(this.update_function) this.update_function( delta_time );
		requestAnimationFrame(this._animate);
	}

	is_set_update = false;
	setUpdate(func=undefined){
		this.update_function = func;
		if(!this.is_set_update) {
			this.is_set_update = true;
			requestAnimationFrame(this._animate);
		}
	}
	setSetup(func){ func(); }
}