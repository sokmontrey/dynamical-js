import { Vector2 } from "./util/vector.js";

export default class PointMass{
    constructor({x, y}, radius=1, is_static=false){
        this.position = new Vector2(x,y);
        this.old_position = new Vector2(x, y);
        this.velocity = new Vector2(0,0);
        this.acceleration = new Vector2(0,0);

        this.mass = 1;
        this.radius = radius;
        this.is_static = is_static;
    }

    applyForce(f){
        this.acceleration = this.acceleration.add(f.divide(this.mass));
    }
    resolveCollision(contact_point, normal){
        //contact_point = contact_point.subtract(this.position.subtract(contact_point).expand(this.radius));
        this.old_position = this.position.subtract(this.old_position)
            .reflect(normal)
            .invert()
            .add(contact_point);

        this.position.assign(contact_point);
    }
    resolveRigidConstraint(contact_point){
        this.position.assign(contact_point);
    }

    updatepositionition(delta_time){
        this.velocity = this.position.subtract(this.old_position);

        this.old_position.assign(this.position);

        this.position = this.position
            .add(this.velocity)
            .add(this.acceleration.multiply(delta_time * delta_time));

        this.acceleration.assign(new Vector2(0,0));
    }

    set position(new_position){
        if(!this.is_static) this.position = new_position;
        return this.position;
    }
    set old_position(new_old_position){
        if(!this.is_static) this.old_position = new_old_position;
        return this.old_position;
    }
    get position(){
        return this.position;
    }
    get old_position(){
        return this.old_position;
    }
}