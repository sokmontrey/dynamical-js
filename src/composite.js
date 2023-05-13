import Abstract from './abstract.js';
import { DistanceConstraint } from './constraint.js';
import PointMass from './point_mass.js';
import { Vector } from './util/dynamical_vector.js';

export default class Composite extends Abstract{
    constructor(){
        super();

        this._initial_offset    = new Vector(0,0);
        this._points            = {};
    }

    setOffset(offset){
        this._initial_offset = offset;
    }

    addPointMass(point){
        const name = point.getName() || Object.keys(this._points).length();
        this._points[name] = point;

        return this;
    }

    createVertex(name=Object.keys(this._points).length(), vertex){
        this._points[name] = PointMass.create(vertex);

        return this;
    }
}
