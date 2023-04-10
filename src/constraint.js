import { Vector2 } from './util/dynamical_vector.js';
/*
point: point mass
p: positionition of point mass
*/

//TODO: test spring constraint

export class Constraint{

    constructor({
        points = []
    }){
        this._points = points;
    }

    addPointMass(point){
        this._points.push(point);
    }

    static create(type, points, params = {}){
        if(type === "rigid"){

            return new DistanceConstraint({
                points: points,
                record_stress: params.record_stress || false,
                spring_constant: 1,
            });

        }else if(type === "spring"){

            return new DistanceConstraint({
                points: points,
                record_stress: params.record_stress || false,
                spring_constant: params.spring_constant || 10,
            });

        }else if(type === "container"){

            return new ContainerConstraint({
                points: points,
                vertices: params.vertices || []
            })

        }else if(type === "rectangle_container"){

            const offset = params.offset || new Vector2(0,0);
            const w = params.width || 500;
            const h = params.height || 500;

            return new ContainerConstraint({
                points: points,
                vertices: [
                    offset,
                    offset.add(new Vector2(w, 0)),
                    offset.add(new Vector2(w, h)),
                    offset.add(new Vector2(0, h))
                ]
            });

        }else if(type === "circle_container"){

            return new CircleContainerConstraint({
                points: points,
                radius: params.radius || 250,
                offset: params.offset || new Vector2(0,0),
            });

        }
    }

    get points(){ return this._points; }
}

/* points: 2D array contain batchs of constraint. 
* Each batch is the actual information indicating which points connecting together
* */
export class DistanceConstraint extends Constraint{
    constructor(params){
        super(params);

        this._distance = [];
        this._spring_constant = params.spring_constant || 1;
        this._is_record_stress = params.record_stress || false;
        this._stresses = [];

        /* Setup equilabrium distance for each constraint */
        for(let i=1; i< this._points.length; i++){
            this._distance.push(Vector2.distance(
                this._points[i-1].position, this._points[i].position
            ));
        }

        /* Setup stress record */
        if(this._is_record_stress){
            for(let i=0; i<points.length-1; i++){
                this._stresses.push(0);
            }
        }
    }
    check(){
        for(let i=1; i<this._points.length; i++){
            const point1 = this._points[i-1];
            const point2 = this._points[i];

            const p1 = point1.position;
            const p2 = point2.position;

            const l2 = Vector2.distance(p1,p2);
            const l1 = this._distance[i-1];

            if(l2 != l1){
                const difference_in_length = (l1-l2);

                if(this._is_record_stress) {
                    this._stresses[i-1] = this._stresses[i-1] + Math.abs(difference_in_length);
                }

                const error = Vector2.normalize(
                    p1.subtract(p2)
                ).multiply( (this._spring_constant) * difference_in_length );

                const m1_reciprocal = 1 / point1.mass;
                const m2_reciprocal = 1 / point2.mass;

                // 1/m1 + 1/m2
                const sum_reciprocal = m1_reciprocal + m2_reciprocal;

                const new_p1 = p1.add(
                    error.multiply(m1_reciprocal / sum_reciprocal)
                );
                const new_p2 = p2.subtract(
                    error.multiply(m2_reciprocal / sum_reciprocal)
                );

                point1.resolveDistanceConstraint(new_p1);
                point2.resolveDistanceConstraint(new_p2);
            }
        }
    }

    get stresses() { return this._stresses; }

    getConstraint(){
        const result = [];
        for(let i=0; i<this._stresses.length; i++){
            result.push({
                point1: this._points[i],
                point2: this._points[i+1],
                distance: this._distance[i],
                stress: this._stresses[i],
            });
        }
        this.resetStress();
        return result;
    }

    resetStress(){
        for(let i=0; i<this._stresses.length; i++){
            this._stresses[i] = 0;
        }
    }
}

export class ContainerConstraint extends Constraint{
    constructor(params){
        super(params);

        this._vertices = params.vertices || [];
    }

    addVertex(new_vertex){
        this._vertices.push(new_vertex);
    }

    check(){
        for(let i=0; i<this._points.length; i++){
            const point = this._points[i];
            const A = point.position;
            const B = point.old_position;

            for(let i=1; i<this._vertices.length; i++){
                this._check(point, A, B, 
                    this._vertices[i-1], this._vertices[i]
                );
            }

            this._check(point, A, B, 
                this._vertices[this._vertices.length-1], this._vertices[0]
            );
        }
    }

    _check(point, A, B, C, D){
        const contact_point = Vector2.getLineIntersection(A, B, C, D);
        const normal = new Vector2(C.y-D.y, D.x-C.x).normalize();

        //If, somehow, there are no contact_point,
        //just skip
        if(!contact_point) 
            return;

        if(Vector2.isPointInfrontLine(A, C, normal)) 
            return;

        //If the intersection is not even between the segment,
        //Don't bother
        // if(!Vector2.isPointBetweenSegment(contact_point, C, D)) 
        //     return;

        point.resolveCollision(contact_point, normal);
    }

    get vertices() {return this._vertices; }
    getVertex(index){ return this._vertices[index]; } 

    getPoint(index){ return this._points[index]; }
    get points(){ return this._points; }
}

export class CircleContainerConstraint extends ContainerConstraint{
    constructor(params){
        super(params);
        this._radius = params.radius || 250;
        this._offset = params.offset || new Vector2(0,0);
        this._center = params.offset.add(params.radius);
    }
    check(){
        for(let i=0; i<this._points.length; i++){
            const point = this._points[i];
            const A = point.position;

            const to_point = A.subtract(this._center);
            const distance = to_point.magnitude();

            if(distance < this._radius) continue;

            const to_point_normal = to_point.normalize();
            const contact_point = to_point_normal.multiply(this._radius).add(this._center);
            const normal = to_point_normal.invert();

            point.resolveCollision(contact_point, normal);
        }
    }
}
