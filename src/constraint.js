import PhysicObject from './physic_object.js';
import PointMass from './point_mass.js';
import { Vector} from './util/dynamical_vector.js';
import Composite, { Circle } from './composite.js';
/*
point: point mass
p: positionition of point mass
*/

//TODO: test spring constraint

export default class Constraint extends PhysicObject{

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
    constructor(point1=null, point2=null, distance=1, spring_constant=1, is_broken=false){
        super();

        this._point1            =   point1;
        this._point2            =   point2;
        this._distance          =   distance;
        this._stress            =   0;

        this._spring_constant   =   spring_constant;
        this._is_broken         =   is_broken;
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

    draw(line_width=2, renderer=this.graphic.renderer){
        line_width = line_width || this.graphic.line_width;

        const line = renderer.line({
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
    constructor(
        x = 0,
        y = 0,
        width=500, 
        height=500, 
        friction_constant=0.05
    ){

        super();

        this._width                 =   width;
        this._height                =   height;
        this._offset                =   new Vector(x, y, 0);
        this._friction_constant     =   friction_constant;

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

    check(param){
        if(param instanceof PointMass){
            this._checkPoint(param);
        }else if(param instanceof Circle){
            this._checkCircle(param);
        }else if(param instanceof Composite){
            const points = param.getPointsArray();
            for(let i=0; i<points.length; i++){
                this._checkPoint(points[i]);
            }
        }
    }
    _checkPoint(point){
        const P1 = point.position;
        const P2 = point.old_position;

        for(let i=0; i<4; i++){
            const axis = (i % 2 === 0) ? P1.y : P1.x;
            const condition = (i === 0 || i === 3) 
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
    _checkCircle(circle){
        const point = circle.getPoint('center');
        const P1 = point.position;
        const P2 = point.old_position;
        const radius = circle.getRadius();

        const circle_vertices = [
            P1.add(new Vector(0, -radius)),
            P1.add(new Vector(radius,  0)),
            P1.add(new Vector(0,  radius)),
            P1.add(new Vector(-radius,  0)),
        ];

        for(let i=0; i<4; i++){
            const V1 = circle_vertices[i];
            const axis = (i % 2 === 0) ? V1.y : V1.x;
            const condition = (i === 0 || i === 3) 
            ? (axis < this._bounds[i])
            : (axis > this._bounds[i]);

            if(condition){
                const V2 = P2.subtract(P1).add(V1);
                const contact_point = Vector.getLineIntersection(
                    V1, V2,
                    this._vertices[i],
                    this._vertices[i > 2 ? 0 : i+1]
                );
                const normal = this._normals[i];
                point.applyCollision(
                    this,
                    contact_point.subtract(V1).add(P1),
                    normal,
                    0.0
                );
            }
        }
    }
}

export class CircleContainer extends Container{
    constructor(
        x = 0,
        y = 0,
        radius = 250,
    ){
        super();

        this._radius    =   radius;
        this._offset    =   new Vector(x, y, 0);
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
    _checkPoint(point){
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
    _checkCircle(circle){
        const point = circle.getPoint('center');
        const P = point.position;
        const point_radius = circle.getRadius();

        const to_point = P.subtract(this._center);
        const d_to_point = to_point.magnitude();

        if(point_radius + d_to_point >= this._radius){
            const [contact_point, normal] = this._findCorrection(to_point);
            point.applyCollision(
                this,
                contact_point.add(normal.multiply(point_radius)), 
                normal,
                0.0,
                // this._friction_constant,
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
