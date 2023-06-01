import Abstract from './abstract.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';
import { SolidConstraint } from './constraint.js';

export default class Composite extends Abstract{
    constructor(){
        super();

        this._initial_offset    = new Vector(0,0);
        this._points            = {};
        this._offsets           = {};
        this._connections       = [];

        this._is_gravity        = true;
        this._gravity           = new Vector(0, 9.8);

        this._is_static         = false;

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

    static create(type, params={}){
        if(type === "rectangle"){
            const offset = params.position || new Vector(250,250); 
            const angle = params.angle || 0;

            const w = params.width || 90;
            const h = params.height || 70;

            const composite = new Composite()
            .setOffset(offset)

            composite
                .createVertex(new Vector(
                    (-w/2) * Math.cos(angle) - 
                    (-h/2) * Math.sin(angle),
                    (-w/2) * Math.sin(angle) + 
                    (-h/2) * Math.cos(angle)
                ))
                .createVertex(new Vector(
                    ( w/2) * Math.cos(angle) - 
                    (-h/2) * Math.sin(angle),
                    ( w/2) * Math.sin(angle) + 
                    (-h/2) * Math.cos(angle)
                ))
                .createVertex(new Vector(
                    ( w/2) * Math.cos(angle) - 
                    ( h/2) * Math.sin(angle),
                    ( w/2) * Math.sin(angle) + 
                    ( h/2) * Math.cos(angle)
                ))
                .createVertex(new Vector(
                    (-w/2) * Math.cos(angle) - 
                    ( h/2) * Math.sin(angle),
                    (-w/2) * Math.sin(angle) + 
                    ( h/2) * Math.cos(angle)
                ))
            ;

            composite
                .connect(0, 1)
                .connect(1, 2)
                .connect(2, 3)
                .connect(3, 0)
                .connect(0, 2)
                .connect(1, 3)
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

    disableGravity(){
        this._is_gravity = false;

        return this;
    }

    addPointMass(point){
        const name = point.name || Object.keys(this._points).length();
        this._points[name] = point;

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

    applyCollision(other){
        this.checkConstraint(other.getCollider());

        return this;
    }

    applyConstraint(constraint){
        for(let point_name in this._points){
            constraint.check(this._points[point_name]);
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

    getCollider(){
        const collider = new SolidConstraint();
        for(let point_name in this._points){
            collider.addVertex(this._points[point_name].position);
        }
        return collider;
    }

    getPoints(){
        return this._points;
    }
}

