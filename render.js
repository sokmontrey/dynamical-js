class Render {
	canvas; c;
	lastTime = 0;
	isWireFrame = false;
	frameRate = 30;
	frames = [];

	fillColor = "#000000";
	strokeColor = "#000000";
	backgroundColor = "#ffffff";

	init(canvas){
		this.canvas = canvas;
		this.c = canvas.getContext('2d');

		this.c.fillStyle = "#000000";
		this.c.strokeStyle = "#0000000";

		this.hw = canvas.width/2;
		this.hh = canvas.height/2;
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
		if(this.isWireFrame) this.c.stroke();
		else this.c.fill();
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
		this.c.fill();
		this.c.closePath();
	}
	renderBodies(bodies){
		this.c.fillStyle = this.fillColor;
		this.c.strokeStyle = this.strokeColor;
		for(var i=0; i<bodies.length; i++){
			var body = bodies[i];
			if(body.type === 'point'){
				this.renderPoint(body);
			}else{
				this.renderVertices(bodies[i].position, bodies[i].vertices);
			}
		}
	}
	renderLoop(bodies, callback){
		var deltaTime;
		const newTime = Date.now();

		if(!this.lastTime) deltaTime = 0;
		else deltaTime = (newTime - this.lastTime)/1000.0;
		this.lastTime = newTime;

		const isCallback = callback(deltaTime, this)

		this.renderBodies(bodies);

		if(isCallback)
			requestAnimationFrame(()=>{this.renderLoop(bodies, callback)});
	}
	saveFrame(){
		var data = this.canvas.toDataURL("image/png");
		var img = new Image();
		img.src = data;
		this.frames.push(img);
	}
	downloadFrame(){
		//download this.frames one by one 
		for(var i=0; i<this.frames.length; i++){
			var img = this.frames[i];
			var link = document.createElement("a");
			link.download = "frame" + i + ".png";
			link.href = img.src;
			link.click();
		}
	}
	renderAnimation(bodies, duration, callback){
		var deltaTime = 1 / this.frameRate;
		var totalFrame = duration * this.frameRate;
		var frameCount = 0;

		const request =()=> { 
			callback(deltaTime, this);
			this.renderBodies(bodies);
			this.saveFrame();

			frameCount++;
			if(frameCount <= totalFrame)
				requestAnimationFrame(request);
		}
		requestAnimationFrame(request);
	}

}
export default Render;
