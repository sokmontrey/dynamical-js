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
    }

    setOffset(offset){
        this._initial_offset = offset;

        return this;
    }

    addPointMass(point){
        const name = point.getName() || Object.keys(this._points).length();
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

    update(delta_time){
        for(let point_name in this._points){
            this._points[point_name].updatePosition(delta_time);
        }

        for(let point_name in this._points){
            this._points[point_name].applyGravity(delta_time);
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
        for(let connection of this._connections){
            const points = connection.getPoints();
            this._renderer.line({
                start: points[0].position,
                end: points[1].position,
                line_width: 0.9
            }).setStrokeStyle('gray').stroke();
        }

        for(let point_name in this._points){
            this._renderer.circle({
                position: this._points[point_name].position,
                radius: 1,
            }).setFillStyle('gray').fill();
        }

        return this;
    }
}
