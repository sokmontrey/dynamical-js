import { Vector } from "./dynamical_vector.js";
import Camera from "./camera.js";

export default class Renderer {
	constructor(canvas, width=500, height=500){
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		this._width = width;
		this._height = height;

		/* color */
		this._background_color = 'white';
        this.camera = new Camera(this);

		this._update_function;
		this._last_time = 0;
		this._animate = this._animate.bind(this);

		this._resize(width, height);
		this.clear();
	}

	_resize(width, height){
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
		this._context.fillRect(
            this.camera.position.x,
            this.camera.position.y,
            this._width * this.camera.FOV.x,
            this._height* this.camera.FOV.y,
        );
	}

	circle(
        position=new Vector(0,0),
        radius=3,
    ){
        const x = position.x,
            y = position.y;

		this._context.beginPath();
		this._context.arc(x, y, radius, 0, Math.PI * 2);
		this._context.closePath();

        return this;
	}

	line(start=new Vector(0,0),
        end=new Vector(50,50),
        line_width=3,
    ){
        const 
            x1 = start.x,
            y1 = start.y,
            x2 = end.x,
            y2 = end.y;

		this._context.beginPath();
		this._context.moveTo(x1, y1);
		this._context.lineTo(x2, y2);
		this._context.closePath();

        this._context.lineWidth= line_width;

        return this;
	}

	polygon(vertices=[]){
		this._context.beginPath();
		this._context.moveTo(vertices[0].x, vertices[0].y);
		for(let i=1; i<vertices.length; i++){
			this._context.lineTo(vertices[i].x, vertices[i].y);
		}
		this._context.lineTo(vertices[0].x, vertices[0].y);
		this._context.closePath();

        return this;
	}

    //NOTE: this method sometime directly access member of an object without using the object getter
    //      This is to reduce call time
    //      A premature opt, I know
	draw(physic_object){
		const graphic = physic_object.getGraphic();

        const type = physic_object.constructor.name;
        if(type === "PointMass"){

            var position = physic_object._position;
            this.circle(position, graphic.radius)
                .setFillStyle(graphic.fill_color)
                .fill();

        }else if (type === "Composite" || type === "Rectangle"){

            const vertices = physic_object.getPointsArray()
                .map((point_mass)=> point_mass._position);

            const rendering = this.polygon(vertices);

            if(graphic.is_fill)
                rendering.setFillStyle(graphic.fill_color).fill();
            if(graphic.is_stroke)
                rendering.setStrokeStyle(graphic.stroke_color).stroke();
            if(graphic.is_wireframe)
                physic_object.getConnections()
                .forEach((distance_constraint)=>{
                    this.line(
                        distance_constraint._point1._position,
                        distance_constraint._point2._position,
                        graphic.wireframe_width,
                    ).setStrokeStyle(graphic.wireframe_color).stroke();
                });

        }else if(type === "Circle"){

            const position = physic_object.getPosition();
            const rendering = this.circle(position, physic_object.getRadius());
            if(graphic.is_fill)
                rendering.setFillStyle(graphic.fill_color).fill();
            if(graphic.is_stroke)
                rendering.setStrokeStyle(graphic.stroke_color).stroke();
            if(graphic.is_wireframe){
                rendering.setStrokeStyle(graphic.wireframe_color).stroke();
                this.circle(position, graphic.wireframe_width)
                    .setFillStyle(graphic.wireframe_color)
                    .fill();
            }

        }else if(type === "DistanceConstraint"){

            this.line( physic_object._point1._position, 
                    physic_object._point2._position)
                .setLineWidth(graphic.stroke_width)
                .setStrokeStyle(graphic.stroke_color)
                .stroke();

        }else if(type === "Container"){

            Vector.edgeIterator(physic_object._vertices,(V1, V2)=>{
                this.line(V1, V2, graphic.stroke_width)
                .setStrokeStyle(graphic.stroke_color).stroke();
            });

        }else if(type === "CircleContainer"){

            this.circle(physic_object._center, physic_object._radius).setStrokeStyle(graphic.stroke_color).stroke();

        }
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

	_animate(current_time) {
		const delta_time = Math.min(current_time - this._last_time, 1000/30.0) * 0.01;
		this._last_time = current_time;

		if(this._update_function) {
			this._update_function(delta_time);
		}
		requestAnimationFrame(this._animate);
	}

	get context(){ return this._context; }
    getContext(){ return this._context; }

	getCenter(){
		return new Vector(this._width/2.0, this._height/2.0);
	}
	getRandom(){
		return new Vector(
			Math.random() * this._width, 
			Math.random() * this._height 
		);
	}
	getHeight(){
		return this._height;
	}
	getWidth(){
		return this._width;
	}
}
