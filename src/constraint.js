
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
        offset={x: 0, y:0},
    }){

        this._offset_x = offset.x;
        this._offset_y = offset.y;

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
            offset: offset,
        });

        this._width = width;
        this._height = height;
    }

    /*
    use the line equation:
        y-y1 = (y2-y1) * (x-x1) / (x2-x1)
    to find intersection 
    between the box's border (line) 
    and the segment (treat as a line) created by point mass's old and current position. 
    */
    check(){
        for(let i=0; i<this._points.length; i++){
            const p = this._points[i];
            let contact_point, n;

            if(p.position.y > this._height + this._offset_y){
                n = new Vector2(0, -1);
                if(p.old_position.isVertical(p.position)){
                    contact_point = new Vector2(p.position.x, this._height + this._offset_y);
                } else{
                    contact_point = new Vector2(
                        p.position.x 
                        + (this._height + this._offset_y -p.position.y) * (p.position.x-p.old_position.x) 
                        / (p.position.y-p.old_position.y), // x component
                        this._height + this._offset_y // y component
                    )
                }
            } else if(p.position.y < this._offset_y){
                n = new Vector2(0, 1);
                if(p.old_position.isVertical(p.position)){
                    contact_point = new Vector2(p.position.x, this._offset_y);
                }else{
                    contact_point = new Vector2(
                        p.position.x 
                        + (this._offset_y-p.position.y) * (p.position.x-p.old_position.x) 
                        / (p.position.y-p.old_position.y), // x component
                        this._offset_y // y component
                    )
                }
            }else if (p.position.x < this._offset_x){
                n = new Vector2(1, 0);
                if(p.old_position.isHorizontal(p.position)){
                    contact_point = new Vector2(this._offset_x, p.position.y);
                }else{
                    contact_point = new Vector2(
                        this._offset_x, // x component
                        (p.position.y - p.old_position.y) * (this._offset_x - p.position.x) 
                        / (p.position.x - p.old_position.x) + p.position.y // y component
                    );
                }
            }else if(p.position.x > this._width + this._offset_x){
                n = new Vector2(-1, 0);
                if(p.old_position.isHorizontal(p.position)){
                    contact_point = new Vector2(this._width + this._offset_x, p.position.y);
                }else{
                    contact_point = new Vector2(
                        this._width + this._offset_x, // x component
                        (p.position.y - p.old_position.y) * (this._width + this._offset_x- p.position.x) 
                        / (p.position.x - p.old_position.x) + p.position.y // y component
                    );
                }
            }
            //TODO: check vertical wall collision
            if(contact_point) p.resolveCollision(contact_point, n);
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
