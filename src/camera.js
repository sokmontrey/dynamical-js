import { Vector } from './util/dynamical_vector.js';

export default class Camera{
    constructor(renderer){
        this._renderer = renderer;

        this.position = new Vector(0,0);
        this.FOV = new Vector(1,1);
    }
    moveTo(position=new Vector(0,0)){
        this.moveBy(
            position.subtract(this.position.add(new Vector(
                this._renderer.getWidth() * this.FOV.x / 2,
                this._renderer.getHeight()* this.FOV.y / 2
            )))
        );

        return this;
    }
    moveBy(change_in_position=new Vector(0,0)){
        this._renderer.context.translate(
            -change_in_position.x,
            -change_in_position.y
        );

        this.position = this.position.add(change_in_position);

        return this;
    }
    changeFOV(x, y=x){
        this._renderer.context.scale(x, y);
        this.FOV = this.FOV.divide(new Vector(x, y));
    }
}
