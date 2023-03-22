import { Vector2 } from "./util/vector.js";

export default class Point{
    constructor({x, y}, radius=10){
        this.pos = new Vector2(x,y);
        this.old_pos = new Vector2(x, y);
        this.velocity = new Vector2(0,0);
        this.acceleration = new Vector2(0,0);

        this.mass = 1;
        this.radius = radius;
    }

    applyForce(f){
        this.acceleration = this.acceleration.add(f.divide(this.mass));
    }
    resolveCollision(contact_point, normal){
        //contact_point = contact_point.subtract(this.pos.subtract(contact_point).expand(this.radius));
        this.old_pos = this.pos.subtract(this.old_pos)
            .reflect(normal)
            .invert()
            .add(contact_point);

        this.pos.assign(contact_point);
    }
    resolveRigidConstraint(contact_point){
        this.pos.assign(contact_point);
    }

    updatePosition(delta_time){
        this.velocity = this.pos.subtract(this.old_pos);

        this.old_pos.assign(this.pos);

        this.pos = this.pos
            .add(this.velocity)
            .add(this.acceleration.multiply(delta_time * delta_time));

        this.acceleration.assign(new Vector2(0,0));
    }
}