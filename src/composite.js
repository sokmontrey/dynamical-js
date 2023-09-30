import PhysicObject from './physic_object.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';

export default class Composite extends PhysicObject{
    constructor(){
        super();

        this._points            = {};
        this._points_offset     = {};
        this._connections       = [];
        this._collider          = null;

        this._is_gravity        = true;
        this._gravity           = new Vector(0, 9.8);

        this._is_static         = false;
        this._is_circle_composite = false;
        this._friction_constant = 0.01;

        this.graphic.fill();
    }

    isCircle(){
        return this._is_circle_composite;
    }

    static create(type, params={}){
        if(type === "rectangle"){
            return new Rectangle(
                params.position.x,
                params.position.y,
                params.width,
                params.height,
                params.angle,
            );
        }else if( type === 'square' || type === 'cube'){
            return new Rectangle(
                params.position.x,
                params.position.y,
                params.side || 50,
                params.side || 50,
                params.angle,
            );
        }else if( type === 'circle'){
            return new Circle(
                params.position.x,
                params.position.y,
                params.radius,
            );
        }
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
            const offset = this._points_offset[point_name];
            const new_position = position.add(offset);
            this._points[point_name].setPosition(new_position);
            this._points[point_name].setOldPosition(new_position);
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
        const name = point.name || PhysicObject.keys(this._points).length();
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

        this._points[name] = PointMass.create(vertex);
        this._points_offset[name] = vertex;

        return this;
    }

    connect(point1_name, point2_name, spring_constant=1){
        this._connections.push(
            new DistanceConstraint(
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
    getConnections(){
        return this._connections;
    }
}

export class Rectangle extends Composite{
    constructor(
        x = 250,
        y = 250,
        width = 90,
        height = 70,
        angle = 0,
    ){
        super();
        const offset = new Vector(x, y);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const w = width;
        const h = height;

        this.createVertex(new Vector(
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
            .setPosition(offset) 
        ;

        this.connect(0, 1)
            .connect(1, 2)
            .connect(2, 3)
            .connect(3, 0)
            .connect(1, 3)
            .connect(0, 2)
        ;
    }
}

export class Circle extends Composite {
    constructor(
        x = 250,
        y = 250,
        radius = 50,
    ){
        super();

        this._radius            = radius;
        this._is_circle_composite = true;

        this._points            = {
            'center': new PointMass(x, y)
        };

        this._points_offset     = {
            'center': new Vector(0,0)
        };
    }

    setRadius(radius){
        this._radius = radius;

        return this;
    }

    getRadius(){
        return this._radius;
    }
    getPosition(){
        return this._points['center'].position;
    }
}

