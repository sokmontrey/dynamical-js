import Abstract from './abstract.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';

export default class Composite extends Abstract{
    constructor(){
        super();

        this._offset = new Vector(0,0);
        this._points = {};
        this._connections = [];
        this._container;
    }

    setOffset(vector){
        this._offset = vector;
        return this;
    }

    addPointMass(name, relative_position){
        this._points[name] = new PointMass({
            position: this._offset.add(relative_position)
        })
        this._container.addPointMass(this._points[name]);
        return this;
    }

    setContainer(container_constraint){
        this._container = container_constraint;
        return this;
    }

    connect(point1_name, point2_name){
        this._connections.push(
            new DistanceConstraint({})
                .addPointMass(this._points[point1_name])
                .addPointMass(this._points[point2_name])
        );
        return this;
    }

    draw(renderer){
        for(let point_name in this._points){
            const point = this._points[point_name];
            renderer.circle({ 
                position: point.position,
                radius: 5
            }).setFillStyle('white').fill();
        }

        for(let each of this._connections){
            const point1 = each.points[0];
            const point2 = each.points[1];
            renderer.line({
                start: point1.position,
                end: point2.position,
                line_width: 0.5
            }).setStrokeStyle('white').stroke();
        }
    }

    update(delta_time){
        for(let point_name in this._points){
            const point = this._points[point_name];
            point.applyGravity();
        }
        for(let i=0; i<5; i++){
            for(let each of this._connections){
                each.check();
            }
            this._container.check();
            for(let point_name in this._points){
                const point = this._points[point_name];
                point.updatePosition(delta_time / 2);
            }
        }
    }
}
