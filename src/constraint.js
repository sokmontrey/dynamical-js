import Abstract from './abstract.js';
import { Vector} from './util/dynamical_vector.js';
/*
point: point mass
p: positionition of point mass
*/

//TODO: test spring constraint

export class Constraint extends Abstract{

    constructor(){
        super();
    }

    static create(type, params={}){
        if(type === "rigid"){

            const constraint = new DistanceConstraint();
            if( params.points ){
                constraint.setPointMass(
                    params.points[0], params.points[1]
                );
            }
            return constraint;

        }else if(type === "spring"){

            return new DistanceConstraint()
                .setSpringConstant(0.5);

        }else if(type === "container"){

            const constraint = new ContainerConstraint();
            if(params.vertices){
                for(let vertex of params.vertices)
                    container.addPointMass(vertex);
            }
            return constraint;

        }else if(type === "rectangle_container"){

            const offset = params.offset || new Vector(0,0);
            const w = params.width || 500;
            const h = params.height || 500;

            return new ContainerConstraint()
                .addVertex( offset )
                .addVertex( offset.add(new Vector(w, 0)) )
                .addVertex( offset.add(new Vector(w, h)) )
                .addVertex( offset.add(new Vector(0, h)) );

        }else if(type === "circle_container"){
            
            const constraint = new CircleContainerConstraint();
            if( params.radius ) container.setRadius(params.radius);
            if( params.offset ) container.setOffset(params.offset);
            return constraint;

        }
    }
}

/* points: 2D array contain batchs of constraint. 
* Each batch is the actual information indicating which points connecting together
* */
export class DistanceConstraint extends Constraint{
    constructor(){
        super();

        this._point1            =   null;
        this._point2            =   null;
        this._distance          =   1;
        this._stress            =   0;

        this._spring_constant   =   1;
        this._is_broken = false;
    }

    break(){
        this._is_broken = true;

        return this;
    }

    setSpringConstant(spring_constant){
        this._spring_constant = spring_constant;

        return this;
    }

    setDistance(distance){
        this._distance = distance;

        return this;
    }

    setPointMass(point1, point2){
        this._point1 = point1;
        this._point2 = point2;

        this._distance = Vector.distance(
            point1.position, point2.position
        );

        return this;
    }

    getPoints(){ return [this._point1, this._point2]; }
    getStress(){ return this._stress; }

    check(){
        if(this._is_broken) return;

        const point1 = this._point1;
        const point2 = this._point2;

        const p1 = point1.position;
        const p2 = point2.position;

        const l1 = this._distance;
        const l2 = Vector.distance(p1, p2);
        const dl = l1-l2;

        this._stress = Math.abs(dl);

        if(dl != 0){
            const [new_p1, new_p2] = this._findCorrection(
                p1, p2, 
                point1.mass, point2.mass,
                point1.isStatic(), point2.isStatic(),
                dl,
                this._spring_constant,
            );

            point1.applyDistanceConstraint(new_p1);
            point2.applyDistanceConstraint(new_p2);
        }
    }
    _findCorrection(
        p1, p2,
        m1, m2,
        is_point1_static, is_point2_static,
        difference_in_length,
        spring_constant,
    ){
        const error = Vector.normalize(
            p1.subtract(p2)
        ).multiply( 
            spring_constant * difference_in_length 
        );

        const m1_reciprocal = 1 / m1;
        const m2_reciprocal = 1 / m2;

        // 1/m1 + 1/m2
        const sum_reciprocal = m1_reciprocal + m2_reciprocal;

        const new_p1 = p1.add(
            is_point2_static ? error
                : error.multiply(m1_reciprocal / sum_reciprocal)
        );

        const new_p2 = p2.subtract(
            is_point1_static ? error
                : error.multiply(m2_reciprocal / sum_reciprocal)
        );
        return [new_p1, new_p2];
    }
}

export class ContainerConstraint extends Constraint{
    constructor(){
        super();

        this._vertices          =   [];
        this._friction_constant =   0.05;
    }

    addVertex(vertex, y=null){
        if(vertex instanceof Vector){
            this._vertices.push(vertex);
        } else {
            this._vertices.push(new Vector(vertex, y));
        }

        return this;
    }
    setFrictionConstant(friction_constant){
        this._friction_constant = friction_constant;

        return this;
    }

    getVertices(){ return this._vertices; }
    getVertex(index){ return this._vertices[index]; } 

    check(point){
        const P1 = point.position;
        const P2 = point.old_position;

        this._verticesIterator((V1, V2)=>{
            const [contact_point, normal] = this._checkEachVertex(
                P1, P2, V1, V2
            );

            if(this._verifyIntersecption(contact_point, normal, P1, V1)){
                point.applyCollision(
                    this,
                    contact_point,
                    normal,
                    this._friction_constant,
                );
            }
        });
    }

    _verticesIterator(callback){
        for(let i=1; i<this._vertices.length; i++){
            callback(
                this._vertices[i-1], this._vertices[i]
            );
        }
        callback(
            this._vertices[this._vertices.length-1], this._vertices[0]
        );
    }

    _verifyIntersecption(contact_point, normal, P1, V1){
        //If, somehow, there are no contact_point,
        //just skip
        if(!contact_point) 
            return false;

        if(Vector.isPointInfrontLine(P1, V1, normal)) 
            return false;

        //If the intersection is not even between the segment,
        //Don't bother
        // if(!Vector.isPointBetweenSegment(contact_point, C, D)) 
        //     return;

        return true;
    }

    //check for one point with one segment
    _checkEachVertex(P1, P2, V1, V2){
        const contact_point = Vector.getLineIntersection(P1, P2, V1, V2);
        const normal = new Vector(V1.y-V2.y, V2.x-V1.x).normalize();

        return [contact_point, normal];
    }
}

export class CircleContainerConstraint extends ContainerConstraint{
    constructor(){
        super();

        this._radius    =   250;
        this._offset    =   new Vector(0,0,0);
        this._center    =   new Vector(0,0,0);

        this._calculateCenter();
    }
    setRadius(radius){
        this._radius = radius;
        this._calculateCenter();

        return this;
    }
    setOffset(offset, y=null){
        if(offset instanceof Vector){
            this._offset.assign(offset);
        }else{
            this._offset.assign(new Vector(offset, y));
        }
        this._calculateCenter();

        return this;
    }
    _calculateCenter(){
        this._center = this._offset.add(this._radius);
        this._center.z = 0;
    }
    check(point){
        const P = point.position;

        const to_point = P.subtract(this._center);
        const distance = to_point.magnitude();

        if(distance >= this._radius){
            const [contact_point, normal] = this._findCorrection(to_point);

            point.applyCollision(
                this,
                contact_point, 
                normal,
                this._friction_constant,
            );
        }
    }
    _findCorrection(to_point){
        const to_point_normal = to_point.normalize();
        const contact_point = to_point_normal.multiply(this._radius).add(this._center);
        const normal = to_point_normal.invert();

        return [contact_point, normal];
    }
}
