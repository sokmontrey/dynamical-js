import Abstract from './abstract.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';

export default class Composite extends Abstract{
    constructor(){
        super();

        this._initial_offset    = new Vector(0,0);
        this._points            = {};
        this._connections       = [];

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

    setOffset(offset){
        this._initial_offset = offset;

        return this;
    }

    addPointMass(point){
        const name = point.name || Object.keys(this._points).length();
        this._points[name] = point;

        return this;
    }

    createVertex(vertex, name){
        name = name || Object.keys(this._points).length;

        this._points[name] = PointMass.create(vertex.add(this._initial_offset));

        return this;
    }

    connect(point1_name, point2_name, spring_constant=1){
        this._connections.push(
            new DistanceConstraint().setPointMass(
                this._points[point1_name],
                this._points[point2_name]
            ).setSpringConstant(spring_constant)
        )

        return this;
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

    update(delta_time){
        for(let point_name in this._points){
            this._points[point_name].updatePosition(delta_time);
        }

        for(let point_name in this._points){
            this._points[point_name].applyGravity();
        }

        for(let connections of this._connections){
            connections.check();
        }


        return this;
    }

    checkConstraint(constraint){
        for(let point_name in this._points){
            constraint.check(this._points[point_name]);
        }

        return this;
    }

    draw(){
        const vertices = [];
        if(this.graphic.is_fill){
            for(let point_name in this._points){
                vertices.push(this._points[point_name].position);
            }

            this.graphic.renderer.polygon({
                vertices: vertices,
            }).setFillStyle(this.graphic.fill_color).fill();
        }

        if(this.graphic.is_wireframe){
            for(let i=0; i<this._connections.length; i++){
                const [point1, point2] = this._connections[i].getPoints();
                this.graphic.renderer.line({
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
                this.graphic.renderer.circle({
                    position: vertices[i],
                    radius: this.graphic.vertex_size,
                }).setFillStyle(this.graphic.vertex_color).fill();
            }
        }

        return this;
    }
}
