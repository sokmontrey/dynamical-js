import Abstract from "./abstract.js";

export class Collider extends Abstract{
    constructor(){
        super();

        this._composite         = null;
        this._friction_constant = 0.05;
        this._is_circle_collider = false;
    }

    isCircle(){
        return this._is_circle_collider;
    }

    setComposite(composite){
        this._composite = composite;

        if(this._composite.isCircle()) 
            this._is_circle_collider = true;

        return this;
    }

    check(collider1, collider2){
        if(collider1.isCircle() && collider2.isCircle()){
            //. Circle & Circle
        } else if(!collider1.isCircle() && !collider2.isCircle()){
            //. Polygon & Polygon
        } else {
            //. Polygon & Circle
        }
    }
}

class PolygonCollider extends Collider{
    constructor(){
        super();
    }

    check(point, constraint){
        const P1 = point.position;
        const point_vertices = constraint._composite.getPointsArray();
        const vertices = point_vertices.map((point)=> point.position);
        const bounds = Vector.getBounds(vertices);
        if(!Vector.isPointInBounds(P1, bounds)) return false;

        const P2 = new Vector(P1.x, bounds.uy + 5);

        const { 
            closest_edge,
            closest_edge_index, 
            contact_point 
        } = PolygonCollider.isPointInPolygon(vertices, P1, P2);

        if(!closest_edge) return false;

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

        /*-----------Resolve------------*/ 

        V1_point.applyCollision(
            constraint, 
            new_V1, 
            normal.invert(),
            constraint._friction_constant,
        )
        V2_point.applyCollision(
            constraint, 
            new_V2, 
            normal.invert(),
            constraint._friction_constant,
        )
        point.applyCollision(
            constraint,
            new_P1,
            normal,
            constraint._friction_constant,
        )
    }

    _isPointInPolygon(vertices, P1, P2){
        let intersection_count = 0;
        let closest_distance = Infinity;
        let closest_edge = null;
        let closest_edge_index = null;
        let contact_point = null;

        Vector.edgeIterator(vertices, (V1, V2, i1, i2)=>{
            if(PolygonCollider.isSegmentIntersect(P1, P2, V1, V2)){
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

        return {
            closest_edge,
            closest_edge_index,
            contact_point,
        };
    }

    _isSegmentIntersect(P1, P2, V1, V2) {
        // const intersection = Vector.getLineIntersection(
        //     P1, P2, V1, V2
        // );

        if(P1.x > Math.max(V1.x, V2.x) || P1.x < Math.min(V1.x, V2.x))
            return false;

        const m = Vector.slope(V1, V2);
        if(!isFinite(m)){
        }else{
            const y = m * (P1.x - V1.x) + V1.y; 
            if(y <= P2.y && y >= P1.y) return true;
        }

        return false;

        // return Vector.isPointOnSegment(P1, P2, intersection) 
        //     && Vector.isPointOnSegment(V1, V2, intersection);
    }
}

class CircleCollider extends Collider{
    check(point, constraint){
        const P1 = point.position;
        const center_point = constraint._composite.getPoint('center');
        const P2 = center_point.position;
        const radius = constraint._composite.getRadius();

        const d = Vector.distance(P1, P2);

        if(d <= radius){
            const [new_p1, new_p2] = CircleCollider.findCorrection(
                P1, P2,
                point.mass, center_point.mass,
                point.isStatic(), center_point.isStatic(),
                radius-d
            );

            point.applyDistanceConstraint(new_p1);
            center_point.applyDistanceConstraint(new_p2);
        }
    }

    _findCorrection(
        p1, p2,
        m1, m2,
        is_point1_static, is_point2_static,
        difference_in_length,
    ){
        const error = Vector.normalize(
            p1.subtract(p2)
        ).multiply( 
            difference_in_length 
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
