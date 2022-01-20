class Render {
	canvas; c;
	lastTime = 0;
	frameRate = 30;
	frames = [];

	isWireFrame = false;
	isShowBounds = false;

	fillColor = "#000000";
	strokeColor = "#aaa";
	backgroundColor = "#ffffff";

	init(canvas){
		this.canvas = canvas;
		this.c = canvas.getContext('2d');

		this.c.fillStyle = "#000000";
		this.c.strokeStyle = this.strokeColor

		this.hw = canvas.width/2;
		this.hh = canvas.height/2;
	}
	setShowBounds(isShowBounds){
		this.isShowBounds = isShowBounds;
	}
	setWireFrame(isWireFrame){
		this.isWireFrame = isWireFrame;
	}
	setBackgroundColor(backgroundColor){
		this.c.fillStyle = backgroundColor;
		this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.backgroundColor = backgroundColor;
	}
	setFrameRate(frameRate){
		this.frameRate = frameRate;
	}
	clearCanvas(){
		this.c.fillStyle = this.backgroundColor;
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	renderVertices(position, vertices){
		var i;
		this.c.beginPath();
		this.c.moveTo(
			Math.floor(position.x + vertices[0].x + this.hw), 
			Math.floor(position.y - vertices[0].y + this.hh)
		);
		for(i=0; i<vertices.length; i++){
			this.c.lineTo(
				Math.floor(position.x + vertices[i].x + this.hw), 
				Math.floor(position.y - vertices[i].y + this.hh)
			);
		}
		this.c.lineTo(
			Math.floor(position.x + vertices[0].x + this.hw), 
			Math.floor(position.y - vertices[0].y + this.hh)
		);
		if(this.isWireFrame) {
			this.c.stroke();
			this.c.lineWidth = 3;
		}else this.c.fill();
		this.c.closePath();
	}
	renderPoint(point){
		var size = point.size;
		this.c.beginPath();
		this.c.arc(
			Math.floor(point.position.x + this.hw), 
			Math.floor(point.position.y + this.hh), 
			size, 0, 2*Math.PI, false
		);
		if(this.isWireFrame) {
			this.c.stroke();
			this.c.lineWidth = 3;
		}else this.c.fill();
		this.c.closePath();
	}
	renderBounds(body){
		var bounds = body.bounds;
		var position = body.position;
		this.c.beginPath();
		this.c.moveTo(bounds.minX + this.hw + position.x, bounds.minY + this.hh + position.y);
		this.c.lineTo(bounds.minX + this.hw + position.x, bounds.maxY + this.hh + position.y);
		this.c.lineTo(bounds.maxX + this.hw + position.x, bounds.maxY + this.hh + position.y);
		this.c.lineTo(bounds.maxX + this.hw + position.x, bounds.minY + this.hh + position.y);
		this.c.lineTo(bounds.minX + this.hw + position.x, bounds.minY + this.hh + position.y);
		this.c.strokeStyle = "#33aa33";
		this.c.lineWidth = 4;
		this.c.stroke();
		this.c.closePath();
	}

	renderBodies(bodies){
		this.c.strokeStyle = this.strokeColor;
		for(var i=0; i<bodies.length; i++){
			this.c.fillStyle = bodies[i].color;
			var body = bodies[i];
			if(body.type === 'point'){
				this.renderPoint(body);
			}else{
				this.renderVertices(bodies[i].position, bodies[i].vertices);
			}
			if(this.isShowBounds){
				this.renderBounds(bodies[i]);
			}
		}
	}
	renderLoop(bodies, callback){
		var deltaTime;
		const newTime = Date.now();

		if(!this.lastTime) deltaTime = 0;
		else deltaTime = (newTime - this.lastTime)/1000.0;
		this.lastTime = newTime;

		const isCallback = callback(deltaTime, this);
		this.renderBodies(bodies);

		if(isCallback)
			requestAnimationFrame(()=>{this.renderLoop(bodies, callback)});
	}
}
export default Render;
