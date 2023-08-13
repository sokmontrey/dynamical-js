import Abstract from './abstract.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';

export default class Composite extends Abstract{
    constructor(){
        super();

        this._initial_offset    = new Vector(0,0);
        this._points            = {};
        this._offsets           = {};
        this._connections       = [];
        this._collider          = null;

        this._is_gravity        = true;
        this._gravity           = new Vector(0, 9.8);

        this._is_static         = false;
        this._is_circle_composite = false;
        this._friction_constant = 0.01;

        this.graphic = {
            ...this.graphic,
            
            is_fill: true,
            is_wireframe: false,
            is_vertex: false,

            fill_color: 'white',
            wireframe_color: 'gray',
            vertex_color: '#aa3333',

            wireframe_thickness: 1,
            vertex_size: 3,
        };
    }

    isCircle(){
        return this._is_circle_composite;
    }

    static create(type, params={}){
        if(type === "rectangle"){
            const offset = params.position || new Vector(250,250); 
            const angle = params.angle || 0;
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const w = params.width || 90;
            const h = params.height || 70;

            const composite = new Composite()
            .setOffset(offset)

            composite
                .createVertex(new Vector(
                    (-w/2) * cos - (-h/2) * sin,
                    (-w/2) * sin + 
                    (-h/2) * cos
                ))
                .createVertex(new Vector(
                    ( w/2) * cos - 
                    (-h/2) * sin,
                    ( w/2) * sin + 
                    (-h/2) * cos
                ))
                .createVertex(new Vector(
                    ( w/2) * cos - 
                    ( h/2) * sin,
                    ( w/2) * sin + 
                    ( h/2) * cos
                ))
                .createVertex(new Vector(
                    (-w/2) * cos - 
                    ( h/2) * sin,
                    (-w/2) * sin + 
                    ( h/2) * cos
                ))
            ;

            composite
                .connect(0, 1)
                .connect(1, 2)
                .connect(2, 3)
                .connect(3, 0)
                .connect(1, 3)
                .connect(0, 2)
            ;

            return composite;
        }else if( type === 'square' || type === 'cube'){
            const offset = params.position || new Vector(250,250); 
            const angle = params.angle || 0;

            const w = params.side || 50;
            const h = w;

            const composite = Composite.create('rectangle', {
                position: offset,
                width: w,
                height: h,
                angle: angle,
            })

            return composite;
        }else if( type === 'circle'){
            const offset = params.position || new Vector(250,250);
            const radius = params.radius || 50;

            const composite = new CircleComposite()
                .setOffset(offset)
                .setRadius(radius)
            ;

            return composite;
        }
    }

    setOffset(offset){
        this._initial_offset = offset;

        return this;
    }

    static(){
        this._is_static = true;

        for(let point_name in this._points){
            this._points[point_name].static();
        }

        return this;
    }

    setGravity(gravity=new Vector(0, 9.8)){
        this._is_gravity = true;
        this._gravity = gravity;

        return this;
    }

    setPosition(position){
        for(let point_name in this._points){
            const v = this._points[point_name].position.subtract(this._initial_offset);
            this._points[point_name].setPosition(position.add(v));
            this._points[point_name].setOldPosition(position.add(v));
        }

        return this;
    }

    setVelocity(velocity){
        for(let point_name in this._points){
            this._points[point_name].setVelocity(velocity);
        }

        return this;
    }

    disableGravity(){
        this._is_gravity = false;

        return this;
    }

    addPointMass(point){
        const name = point.name || Object.keys(this._points).length();
        this._points[name] = point;

        return this;
    }

    applyForce(force){
        for(let point_name in this._points){
            this._points[point_name].applyForce(force)
        }

        return this;
    }

    createVertex(vertex, name){
        name = name || Object.keys(this._points).length;

        const position = vertex.add(this._initial_offset);

        this._points[name] = PointMass.create(position);
        this._offsets[name] = position;

        return this;
    }

    connect(point1_name, point2_name, spring_constant=1){
        this._connections.push(
            new DistanceConstraint().setPointMass(
                this._points[point1_name],
                this._points[point2_name]
            ).setSpringConstant(spring_constant)
        );

        return this;
    }

    getConnection(index){
        return this._connections[index];
    }

    setRenderer(renderer){
        this.graphic.renderer = renderer;

        for(let point_name in this._points){
            this._points[point_name].setRenderer(renderer);
        }

        for(let i=0; i<this._connections.length; i++){
            this._connections[i].setRenderer(renderer);
        }

        return this;
    }

    updatePosition(delta_time){
        for(let point_name in this._points){
            this._points[point_name].updatePosition(delta_time);
        }
        return this;
    }

    applyConnections(){
        for(let i=0; i<this._connections.length; i++){
            this._connections[i].check();
        }

        return this;
    }

    applyGravity(){
        if(this._is_gravity){
            for(let point_name in this._points){
                this._points[point_name].applyGravity(
                    this._gravity
                );
            }
        }
        return this;
    }

    draw(renderer=this.graphic.renderer){
        const vertices = [];
        if(this.graphic.is_fill){
            for(let point_name in this._points){
                vertices.push(this._points[point_name].position);
            }

            renderer.polygon({
                vertices: vertices,
            }).setFillStyle(this.graphic.fill_color).fill();
        }

        if(this.graphic.is_wireframe){
            for(let i=0; i<this._connections.length; i++){
                const [point1, point2] = this._connections[i].getPoints();
                renderer.line({
                    start: point1.position,
                    end: point2.position,
                    line_width: this.graphic.wireframe_thickness,
                }).setStrokeStyle(this.graphic.wireframe_color).stroke();
            }
        }

        if(this.graphic.is_vertex){
            if(!vertices.length){
                for(let point_name in this._points){
                    vertices.push(this._points[point_name].position);
                }
            }

            for(let i=0; i<vertices.length; i++){
                renderer.circle({
                    position: vertices[i],
                    radius: this.graphic.vertex_size,
                }).setFillStyle(this.graphic.vertex_color).fill();
            }
        }

        return this;
    }

    getPoints(){
        return this._points;
    }
    getPointsArray(){
        return Object.values(this._points);
    }
    getPointNames(){
        return Object.keys(this._points);
    }
    getPoint(point_name){
        return this._points[point_name];
    }
    get friction_constant(){ 
        return this._friction_constant;
    }
}

export class CircleComposite extends Composite {
    constructor(){
        super();

        this._initial_offset    = new Vector(250,250);
        this._radius            = 50;
        this._is_circle_composite = true;

        this._points            = {
            'center': new PointMass().setPosition(this._initial_offset),
        }
    }

    setRadius(radius){
        this._radius = radius;

        return this;
    }

    setOffset(offset){
        this._initial_offset = offset;
        this.setPosition(offset);
        this.setOldPosition(offset);

        return this;
    }

    draw(renderer=this.graphic.renderer){

        //TODO: wireframe
        const circle = renderer.circle({
            position: this._points['center'].position,
            radius: this._radius,
        });

        if(this.graphic.is_fill){
            circle.setFillStyle(this.graphic.fill_color).fill();
        }

        if(this.graphic.is_wireframe){
            circle.setStrokeStyle(this.graphic.wireframe_color).stroke();
        }

        return this;
    }

    getRadius(){
        return this._radius;
    }
    getPosition(){
        return this._points['center'].position;
    }
}

