class Render {
	canvas; c;
	lastTime = 0;
	frameRate = 30;
	frames = [];

	isWireFrame = false;
	isShowBounds = false;

	fillColor = "#000000";
	strokeColor = "#aaa";

	init(canvasContainer, width, height){
		this.width = width;
		this.height = height;

		this.hw = width/2;
		this.hh = height/2;

		this.canvasContainer = canvasContainer;
		this.layer = {};
		this.createLayer(0);
	}
	createLayer(layer){
		if(this.layer[layer]) return;
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.style.zIndex = layer;
		canvas.style.position = 'absolute';
		canvas.style.top = '0px';
		canvas.style.left = '0px';

		const c = canvas.getContext('2d');
		this.canvasContainer.appendChild(canvas)

		this.layer[layer] = {
			canvas: canvas,
			c: c
		};
		c.fillStyle = "#000000";
		c.strokeStyle = this.strokeColor;
	}
	setShowBounds(isShowBounds){
		this.isShowBounds = isShowBounds;
	}
	setWireFrame(isWireFrame){
		this.isWireFrame = isWireFrame;
	}
	setFrameRate(frameRate){
		this.frameRate = frameRate;
	}
	clearCanvas(layer){
		const c = this.layer[layer].c;
		c.clearRect(0, 0, this.width, this.height);
	}
	fillBackground(color, layer){
		const c = this.layer[layer].c;
		c.fillStyle = color;
		c.fillRect(0, 0, this.width, this.height);
	}
	renderVertices(position, vertices, layer){
		var i;
		const c = this.layer[layer].c;
		c.beginPath();
		c.moveTo(
			Math.floor( position.x + vertices[0].x + this.hw), 
			Math.floor(-position.y - vertices[0].y + this.hh)
		);
		for(i=0; i<vertices.length; i++){
			c.lineTo(
				Math.floor( position.x + vertices[i].x + this.hw), 
				Math.floor(-position.y - vertices[i].y + this.hh)
			);
		}
		c.lineTo(
			Math.floor(position.x + vertices[0].x + this.hw), 
			Math.floor(-position.y - vertices[0].y + this.hh)
		);
		if(this.isWireFrame) {
			c.stroke();
			c.lineWidth = 3;
		}else c.fill();
		c.closePath();
	}
	renderPoint(point, layer){
		var size = point.size;
		const c = this.layer[layer].c;

		c.beginPath();
		c.arc(
			Math.floor( point.position.x + this.hw), 
			Math.floor(-point.position.y + this.hh), 
			size, 0, 2*Math.PI, false
		);
		if(this.isWireFrame) {
			c.stroke();
			c.lineWidth = 3;
		}else c.fill();
		c.closePath();
	}

	renderBodies(bodies, layer){
		const c = this.layer[layer].c;

		c.strokeStyle = this.strokeColor;
		for(var i=0; i<bodies.length; i++){
			c.fillStyle = bodies[i].color;
			var body = bodies[i];
			if(body.type === 'point'){
				this.renderPoint(body, layer);
			}else{
				this.renderVertices(
					bodies[i].position, 
					bodies[i].vertices,
					layer
				);
			}
		}
	}
	renderLoop(bodies, callback=()=>{}, layer=0){
		var deltaTime;
		const newTime = Date.now();

		if(!this.lastTime) deltaTime = 0;
		else deltaTime = (newTime - this.lastTime)/1000.0;
		this.lastTime = newTime;

		const isCallback = callback(deltaTime, this);

		this.createLayer(layer);
		this.renderBodies(bodies, layer);

		if(isCallback)
			requestAnimationFrame(()=>{this.renderLoop(bodies, callback)});
	}
	render(bodies, callback=()=>{}, layer=0){
		const isCallback = callback(this);

		this.createLayer(layer);
		this.renderBodies(bodies, layer);
	}
}
export default Render;
