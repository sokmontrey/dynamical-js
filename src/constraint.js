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

            const offset = params.offset || new Vector(0,0);
            const w = params.width || 500;
            const h = params.height || 500;

            return new Container()
                .setOfffset(offset)
                .setWidth(w)
                .setHeight(h);

        }else if(type === "circle_container"){
            
            const constraint = new CircleContainer();
            if( params.radius ) constraint.setRadius(params.radius);
            if( params.offset ) constraint.setOffset(params.offset);
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

    draw(line_width){
        line_width = line_width || this.graphic.line_width;

        const line = this.graphic.renderer.line({
            start: this._point1.position,
            end: this._point2.position,
            line_width: line_width
        }).setStrokeStyle(this.graphic.stroke_style).stroke();

        return line;
    }

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

        const sum_m = m1 + m2;

        const new_p1 = p1.add(
            is_point2_static ? error
                : error.multiply(m2 / sum_m)
        );

        const new_p2 = p2.subtract(
            is_point1_static ? error
                : error.multiply(m1 / sum_m)
        );
        return [new_p1, new_p2];
    }
}

export class Container extends Constraint{
    constructor(){
        super();

        this._width                 =   500;
        this._height                =   500;
        this._offset                =   new Vector(0,0);
        this._friction_constant     =   0.05;

        this._vertices              =   [
            new Vector(0,0),
            new Vector(0,0),
            new Vector(0,0),
            new Vector(0,0),
        ];
        this._bounds                =   [0,0,0,0];
        this._normals               =   [
            new Vector( 0,  1),
            new Vector(-1,  0),
            new Vector( 0, -1),
            new Vector( 1,  0),
        ];

        this.graphic.is_fill = false;
        this.graphic.is_stroke = true;

        this._calculateVertices();
        this._calculateBounds();
    }

    _calculateVertices(){
        this._vertices[0] = this._offset;
        this._vertices[1] = this._offset.add(
            new Vector(this._width, 0)
        );
        this._vertices[2] = this._offset.add(
            new Vector(this._width, this._height)
        );
        this._vertices[3] = this._offset.add(
            new Vector(0, this._height)
        );
    }
    _calculateBounds(){
        this._bounds = [
            this._offset.y,
            this._offset.x + this._width,
            this._offset.y + this._height,
            this._offset.x,
        ];
    }

    setWidth(width){
        this._width = width;

        this._calculateVertices();
        this._calculateBounds();

        return this;
    }

    setHeight(height){
        this._height = height;

        this._calculateVertices();
        this._calculateBounds();

        return this;
    }

    setOfffset(offset){
        this._offset = offset;

        this._calculateVertices();
        this._calculateBounds();

        return this;
    }
    setFrictionConstant(friction_constant){
        this._friction_constant = friction_constant;

        return this;
    }

    draw(renderer=this.graphic.renderer){
        const polygon = renderer.polygon({
            vertices: this._vertices
        });

        this.graphic.applyStyle(polygon);

        return polygon;
    }

    check(point){
        const P1 = point.position;
        const P2 = point.old_position;

        for(let i=0; i<4; i++){
            const axis = (i % 2 == 0) ? P1.y : P1.x;
            const condition = (i == 0 || i == 3) 
            ? (axis < this._bounds[i])
            : (axis > this._bounds[i]);

            if(condition){
                const contact_point = Vector.getLineIntersection(
                    P1, P2, 
                    this._vertices[i],
                    this._vertices[i > 2 ? 0 : i+1]
                );
                const normal = this._normals[i];
                point.applyCollision(
                    this,
                    contact_point,
                    normal,
                    this._friction_constant,
                );
            }
        }
    }
}

export class CircleContainer extends Container{
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
    draw(renderer=this.graphic.renderer){
        const circle = renderer.circle({
            position: this._center,
            radius: this._radius,
        });

        this.graphic.applyStyle(circle);

        return circle;
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

export class CompositeCollider extends Constraint{
    constructor(){
        super();

        this._composite         = null;
        this._friction_constant = 0.05;
    }

    setComposite(composite){
        this._composite = composite;
        return this;
    }

    check(point){
        const P1 = point.position;
        const point_vertices = this._composite.getPointsArray();
        const vertices = point_vertices.map((point)=> point.position);
        const bounds = Vector.getBounds(vertices);
        if(!Vector.isPointInBounds(P1, bounds)) return false;

        const P2 = new Vector(bounds.ux, P1.y);

        let intersection_count = 0;
        let closest_distance = Infinity;
        let closest_edge = null;
        let closest_edge_index = null;
        let contact_point = null;

        Vector.edgeIterator(vertices, (V1, V2, i1, i2)=>{
            if(this._isSegmentIntersect(P1, P2, V1, V2)){
                intersection_count ++;
            }

            const closest_point = Vector.closestPointOnSegment(
                P1, V1, V2
            );
            const distance = Vector.distance(
                P1, 
                closest_point
            );

            if (distance < closest_distance) {
                closest_distance = distance;
                closest_edge = {V1, V2};
                closest_edge_index = {i1, i2};
                contact_point = closest_point;
            }
        });

        if(intersection_count % 2 == 0) return false;

        const V1 = closest_edge.V1;
        const V2 = closest_edge.V2;
        const V1_point = point_vertices[closest_edge_index.i1];
        const V2_point = point_vertices[closest_edge_index.i2];

        const correction_vector = contact_point.subtract(P1);
        const m1 = point.mass;
        const m2 = V1_point.mass + V2_point.mass;

        const sum_m = m1 + m2;
        const correction_P1 = correction_vector.multiply(m2 / sum_m);
        const correction_V = correction_vector.invert().multiply(m1 / sum_m);
        const new_P1 = P1.add(correction_P1);

        const V1_d = Vector.distance(
            new_P1, V1
        );
        const V2_d = Vector.distance(
            new_P1, V2
        );

        const V_d_sum = V1_d + V2_d;

        const new_V1 = V1.add(correction_V.multiply(V2_d/V_d_sum));
        const new_V2 = V2.add(correction_V.multiply(V1_d/V_d_sum));
        const normal = correction_vector.normalize();

        V1_point.applyCollision(
            this, 
            new_V1, 
            normal.invert(),
            this._friction_constant,
        )
        V2_point.applyCollision(
            this, 
            new_V2, 
            normal.invert(),
            this._friction_constant,
        )
        
        point.applyCollision(
            this,
            new_P1,
            normal,
            this._friction_constant,
        )
    }
    _isSegmentIntersect(P1, P2, V1, V2) {
        const intersection = Vector.getLineIntersection(
            P1, P2, V1, V2
        );

        return Vector.isPointOnSegment(P1, P2, intersection) 
            && Vector.isPointOnSegment(V1, V2, intersection);
    }
}
