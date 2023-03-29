import { Vector2 } from "./util/vector.js";

export default class PointMass{
    constructor(
    {
        x=0, y=0
    }={}, 
    {
        radius=1, 
        is_static=false,
        mass=1,
    }={}){
        this._position = new Vector2(x,y);
        this._old_position = new Vector2(x, y);
        this._velocity = new Vector2(0,0);
        this._acceleration = new Vector2(0,0);

        this._mass = mass;
        this._radius = radius;
        this._is_static = is_static;
    }

    applyForce(f){
        this._acceleration = this._acceleration.add(f.divide(this._mass));
    }
    resolveCollision(contact_point, normal){
        if(this._is_static) return;

        //contact_point = contact_point.subtract(this._position.subtract(contact_point).expand(this.radius));
        this._old_position = this._position.subtract(this._old_position)
            .reflect(normal)
            .invert()
            .add(contact_point);

        this._position.assign(contact_point);
    }

    updatePosition(delta_time){
        if(this._is_static) return;

        this._velocity = this._velocity.add(this._position.subtract(this._old_position));

        this._old_position.assign(this._position);

        this._position = this._position
            .add(this._velocity)
            .add(this._acceleration.multiply(delta_time * delta_time));

        this._velocity.x = 0;
        this._velocity.y = 0;

        this._acceleration.x = 0;
        this._acceleration.y = 0;
    }

    set position(new_position){
        this._position.assign(new_position);
    }
    set old_position(new_old_position){
        this._old_position.assign(new_old_position);
    }
    set velocity(new_velocity){
        this._velocity.assign(new_velocity);
    }
    set mass(new_mass){
        this._mass = new_mass;
    }

    get position(){ return this._position; }
    get old_position(){ return this._old_position; }
    get mass(){ return this._mass; }
    get velocity(){ return this._velocity; }
    get acceleration(){ return this._acceleration; }
    get radius(){ return this._radius; }

    setStatic(){
        this._is_static = true;
    }
    setDynamic(){
        this._is_static = false;
    }
    isStatic(){
        return this._is_static;
    }
}