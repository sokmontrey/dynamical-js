import { Vector2 } from './util/dynamical_vector.js';
/*
point: point mass
p: positionition of point mass
*/

//TODO: check Stress over Tension 

export class DistanceConstraint{
    constructor(points, 
    {
        record_tension=false
    }={}){
        this._points = points;

        this._distance = [];
        for(let i=1; i<points.length; i++){
            this._distance.push(Vector2.distance(
                points[i-1].position, points[i].position
            ));
        }

        //TODO: change the spring constant from stiffness to sfiffness or something
        this._spring_constant = 1;

        this._is_record_tension = record_tension;
        if(record_tension){
            this._tensions = [];

            for(let i=0; i<points.length-1; i++){
                this._tensions.push(0);
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
                const error = Vector2.normalize(
                    p1.subtract(p2)
                ).multiply(this._spring_constant * difference_in_length);

                if(this._is_record_tension) {
                    this._tensions[i-1] = this._tensions[i-1] + Math.abs(difference_in_length);
                }

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

    get points() { return this._points; }

    get tensions() { return this._tensions; }

    getConstraint(){
        const result = [];
        for(let i=0; i<this._tensions.length; i++){
            result.push({
                point1: this._points[i],
                point2: this._points[i+1],
                distance: this._distance[i],
                tension: this._tensions[i],
            });
        }
        this.resetTension();
        return result;
    }

    resetTension(){
        for(let i=0; i<this._tensions.length; i++){
            this._tensions[i] = 0;
        }
    }
}
export class SpringConstraint extends DistanceConstraint{
    constructor(points, {spring_constant=0.04, record_tension=false}={}){
        super(points, {record_tension: record_tension});
        this._spring_constant = spring_constant;
    }
    setSpringConstant(new_spring_constant){
        this._spring_constant = new_spring_constant;
    }
}

export class ContainerConstraint{
    constructor({
        vertices=[],
        points=[],
    }){
        this._points = points;
        this._vertices = vertices;
    }

    addPointMass(point){
        this._points.push(point);
    }

    check(){
        for(
        let point_index=0; 
            point_index<this._points.length; 
            point_index++
        ){

            const point = this._points[point_index];
            const A = point.position;
            const B = point.old_position;

            for(let j=1; j<this._vertices.length; j++){
                this._checkOne( point, A, B, 
                    this._vertices[j-1], this._vertices[j]
                );

                if(j>=this._vertices.length-1){
                    this._checkOne( point, A, B, 
                        this._vertices[j], this._vertices[0]
                    );
                }
            }
        }
    }
    _checkOne(point, A, B, C, D){
        const contact_point = Vector2.getLineIntersection(A, B, C, D);
        const normal = new Vector2(C.y-D.y, D.x-C.x).normalize();

        if(
            contact_point && 
            Vector2.isPointBehindLine(A, C, normal) 
        ){
            point.resolveCollision(contact_point, normal);
        }
    }
}

export class BoxContainerConstraint extends ContainerConstraint{
    constructor(width=500, height=500, points=[], offset=new Vector2(0,0)){
        super({
            points: points,
            vertices: [
                offset,
                new Vector2(offset.x + width, offset.y),
                new Vector2(offset.x + width, offset.y + height),
                new Vector2(offset.x, offset.y + height)
            ]
        });
    }
}

export class CircleContainerConstraint extends ContainerConstraint{
    constructor(radius=250, points=[], offset=new Vector2(0, 0)){
        super({
            points: points,
            vertices: [],
        });
        this._radius = radius;
        this._offset = offset;
        this._center = offset.add(radius);
    }
    check(){
        for(let point_index = 0;
            point_index < this._points.length;
            point_index ++
        ){
            const point = this._points[point_index];
            const A = point.position;

            const to_point = A.subtract(this._center);
            const d = to_point.magnitude();
            if(d >= this._radius){
                const to_point_normal = to_point.normalize();
                const contact_point = to_point_normal.multiply(this._radius).add(this._center);
                const normal = to_point_normal.invert();
                point.resolveCollision(contact_point, normal);
            }
        }
    }
}

export class PointMassCollisionConstraint{
    constructor(){}
    check(point1, point2){
        const p1 = point1.position;
        const p2 = point2.position;

        if(Vector2.distance(p1, p2) < point1.radius + point2.radius){
            const n1 = p2.subtract(p1).normalize();
            const n2 = n1.invert();

            //TODO: finc contact_point for points with different radius
            const cp = p2.add(p1).divide(2);

            const cp1 = cp.subtract(cp.subtract(p1).scaleMagnitudeTo(point1.radius));
            const cp2 = cp.subtract(cp.subtract(p2).scaleMagnitudeTo(point2.radius));

            point1.resolveCollision(cp1, n1);
            point2.resolveCollision(cp2, n2);
        }
    }
}
