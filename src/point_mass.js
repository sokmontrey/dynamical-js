import Abstract from './abstract.js';
import { Vector} from './util/dynamical_vector.js';

export default class PointMass extends Abstract{
    constructor({
        position=new Vector(0,0),
        is_static=false,
        mass=1,
    }){
        super();

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

    setMass(mass){
        this._mass = mass;
        return this;
    }
    static(){
        this._is_static = true;
        return this;
    }
    isStatic(){ return this._is_static; }

    setPosition(position, y=null){
        if(position instanceof Vector)
            this.position = position;
        else
            this.position.assign(new Vector(position, y));

        return this;
    }
    setOldPosition(old_position, y=null){
        if(old_position instanceof Vector)
            this.old_position = old_position;
        else
            this.old_position.assign(new Vector(old_position, y));

        return this;
    }
    setVelocity(velocity, y=null){
        if(velocity instanceof Vector) this._velocity = velocity;
        else this._velocity = new Vector(velocity, y);

        return this;
    }
    addVelocity(velocity, y=null){
        if(velocity instanceof Vector) this._velocity = this._velocity.add(velocity);
        else this._velocity = this.velocity.add(new Vector(velocity, y));

        return this;
    }
    applyForce(force, y=null){
        if(this._is_static) return;

        this._acceleration = this._acceleration.add(
            (force instanceof Vector 
                ? force 
                : new Vector(force, y)
            ).divide(this._mass)
        );

        return this;
    }

    applyGravity(x=0, y=9.8){
        if(this._is_static) return;

        this.applyForce(
            Vector.multiply(
                x instanceof Vector? x : new Vector(x, y), 
                this.mass
            )
        );

        return this;
    }
    applyCollision(
        other_name, 
        contact_point, 
        normal, 
        friction_constant
    ){
        if(this._is_static) return;

        this._resolveCollision(contact_point, normal);
        this._resolveFriction(normal, friction_constant);
    }

    _resolveCollision(contact_point, normal){
        this._old_position.assign(
            this._position
            .subtract(this._old_position)
            .reflect(normal)
            .invert()
            .add(contact_point)
        );
        this._position.assign(contact_point);
    }
    _resolveFriction(normal, friction_constant){

        const v = this._position.subtract(this._old_position);

        //p is a normalized vector pointing parrallel to the surface
        const p = new Vector(normal.y, -normal.x);
        const opposing_v = p.multiply(v.dot(p))
            .invert()
            .multiply(friction_constant);

        this.addVelocity(opposing_v );
    }
    applyDistanceConstraint(new_position){
        if(this._is_static) return;

        this._resolveDistanceConstraint(new_position);
    }
    _resolveDistanceConstraint(new_position){
        this._position.assign(new_position);
    }

    updatePosition(delta_time=0.25){
        if(this._is_static) return;

        this._velocity = this._velocity.add(
            this._position.subtract(this._old_position)
        );
        
        this._old_position.assign(this._position);

        this._position = this._position
            .add(this._acceleration.multiply(delta_time * delta_time))
            .add(this._velocity);

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
}
