import { Vector} from './util/dynamical_vector.js';
export default class PointMass{
    constructor({
        position=new Vector(0,0),
        is_static=false,
        mass=1,
    }){
        this._position = new Vector(position.x,position.y);
        this._old_position = new Vector(position.x, position.y);
        this._velocity = new Vector(0,0,0);
        this._acceleration = new Vector(0,0,0);

        this._mass = mass;
        this._is_static = is_static;
    }

    static create(x=0, y=0){
        return new PointMass({
            position: (x instanceof Vector) ? x : new Vector(x, y) 
        });
    }

    applyForce(f){
        if(this._is_static) return;

        this._acceleration = this._acceleration.add(f.divide(this._mass));
    }
    applyGravity(x=0, y=9.8){
        if(this._is_static) return;

        this.applyForce(
            Vector.multiply(
                x instanceof Vector? x : new Vector(x, y), 
                this.mass
            )
        );
    }
    resolveCollision(contact_point, normal){
        if(this._is_static) return;

        this._old_position.assign(
            this._position
            .subtract(this._old_position)
            .reflect(normal)
            .invert()
            .add(contact_point)
        );
        this._position.assign(contact_point);
    }
    resolveDistanceConstraint(new_position){
        if(this._is_static) return;

        this._position.assign(new_position);
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

    /* Lib interface */
    set position(new_position){
        if(!this._is_static) this._position.assign(new_position);
    }
    set old_position(new_old_position){
        if(!this._is_static) this._old_position.assign(new_old_position);
    }
    set velocity(new_velocity){
        if(!this._is_static) this._velocity.assign(new_velocity);
    }

    get position(){ return this._position; }
    get old_position(){ return this._old_position; }
    get mass(){ return this._mass; }
    get velocity(){ return this._velocity; }
    get acceleration(){ return this._acceleration; }

    setMass(new_mass){
        this._mass = new_mass;
        return this;
    }
    static(){
        this._is_static = true;
        return this;
    }

    setPosition(new_position){
        this.position = new_position;
        return this;
    }
    setOldPosition(new_old_position){
        this.old_position = new_old_position;
    }
    setVelocity(x, y){
        if(x instanceof Vector) this._velocity = x;
        else this._velocity = new Vector(x, y);

        return this;
    }
    isStatic(){
        return this._is_static;
    }
}
