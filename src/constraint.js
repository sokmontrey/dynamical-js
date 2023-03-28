import { Vector2 } from "./util/vector.js";

/*
point: point mass
p: positionition of point mass
*/

//TOOD: fix RigidConstraint act like Spring

export class RigidConstraint{
    constructor(points){
        this._points = points;

        this._distance = [];
        for(let i=1; i<points.length; i++){
            this._distance.push(Vector2.distance(points[i-1].position, points[i].position));
        }

        this._spring_constant = 1;
    }
    check(){
        for(let i=1; i<this._points.length; i++){
            const point1 = this._points[i-1];
            const point2 = this._points[i];

            const p1 = point1.position;
            const p2 = point2.position;

            let cp1, cp2;

            const current_distance = Vector2.distance(p1, p2);

            if(current_distance != this._distance[i-1]){
                const temp_cp = p2.subtract(p1).scaleMagnitudeTo((current_distance - this._distance[i-1])/2 * this._spring_constant);

                cp1 = p1.add(temp_cp);
                cp2 = p2.add(temp_cp.invert());
            }
            // else if(current_distance < this._distance[i-1]){
            //     const temp_cp = p2.subtract(p1).scaleMagnitudeTo((current_distance - this._distance[i-1])/2 * this._spring_constant);

            //     cp1 = p1.add(temp_cp);
            //     cp2 = p2.add(temp_cp.invert());
            // }

            if(cp1){
                point1.resolveRigidConstraint(cp1);
                point2.resolveRigidConstraint(cp2);
            }
        }
    }

    get points() { return this._points; }
}
export class SpringConstraint extends RigidConstraint{
    constructor(points, spring_constant=0.3){
        super(points);
        this._spring_constant = spring_constant;
    }
    setSpringConstant(new_spring_constant){
        this._spring_constant = new_spring_constant;
    }
}

export class BoxConstraint{
    constructor(width, height, points=[], offset=new Vector2(0,0)){
        this._offset_x = offset.x;
        this._offset_y = offset.y;

        this._width = width;
        this._height = height;

        this._points = points;
    }

    addPointMass(point){
        this._points.push(point);
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
            let contact_point = null;
            let n = null;

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
