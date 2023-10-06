import PhysicObject from "../dynamical/physic_object.js";
import { Vector } from "../util/dynamical_vector.js";

//TODO: point-Poly/Cir collision

export default class Collider extends PhysicObject{
    static check(composite1, composite2){
        let is_collide = false;

        if(composite1.isPointMass() || composite2.isPointMass()){
            //one of this is a point 
            if(composite1.isCircle() || composite2.isCircle()){
                // point circle or circle point
                is_collide = composite1.isPointMass()
                ? PointCircleCollider.check(composite1, composite2)
                : PointCircleCollider.check(composite2, composite1);
            }else if(!composite1.isCircle() || !composite2.isCircle()){
                // point polygon or polygon point
                is_collide = composite1.isPointMass()
                ? PointPolygonCollider.check(composite1, composite2)
                : PointPolygonCollider.check(composite2, composite1);
            }
        }else if(composite1.isCircle() && composite2.isCircle()){
            //circle circle
            is_collide = CircleCircleCollider.check(composite1, composite2);
        }else if(composite1.isCircle() || composite2.isCircle()){
            //circle polygon or polygon circle
            is_collide = composite1.isCircle() 
            ? PolygonCircleCollider.check(composite2, composite1)
            : PolygonCircleCollider.check(composite1, composite2);
        }else{
            //polygon polygon
            const points1 = composite1.getPointsArray();
            for(let i=0; i<points1.length; i++){
                is_collide = PointPolygonCollider.check(points1[i], composite2) || is_collide;
            }
            const points2 = composite2.getPointsArray();
            for(let i=0; i<points2.length; i++){
                is_collide = PointPolygonCollider.check(points2[i], composite1) || is_collide;
            }
        }

        if(is_collide){
            composite1.onCollision(composite1, composite2);
            composite2.onCollision(composite2, composite1);
        }else{
            composite1.onNoCollision(composite1, composite2);
            composite2.onNoCollision(composite2, composite1);
        }
    }
}

export class CircleCircleCollider{
    static check(circle1, circle2){
        const point1 = circle1.getCenterPoint();
        const point2 = circle2.getCenterPoint();

        const P1 = point1.position;
        const P2 = point2.position;

        const radius1 = circle1.getRadius();
        const radius2 = circle2.getRadius();

        const d = Vector.distance(P1, P2);
        //difference
        const diff = d - (radius1 + radius2);

        if(diff > 0) return false;

        const normal = P1.subtract(P2).normalize();
        const correction_vector = normal.multiply(diff); 
        const m1 = point1.mass;
        const m2 = point2.mass;

        const sum_m = m1+m2;
        const correction_P1 = correction_vector.invert().multiply(m2/sum_m);
        const correction_P2 = correction_vector.multiply(m1/sum_m);

        point1.applyCollision(
            point2,
            correction_P1.add(P1),
            normal,
            0
        );
        point2.applyCollision(
            point1,
            correction_P2.add(P2),
            normal.invert(),
            0
        );

        return true;
    }
}

export class PolygonCircleCollider{
    static check(polygon, circle){
        const point_vertices = polygon.getPointsArray();
        const vertices = point_vertices.map((point)=> point.position);
        const point = circle.getCenterPoint();
        const P1 = point.position;
        const radius = circle.getRadius();

        const { 
            closest_edge,
            closest_edge_index, 
            contact_point 
        } = PolygonCircleCollider.isCircleIntersect(vertices, P1, radius);

        if(!closest_edge) return false;

        const V1 = closest_edge.V1;
        const V2 = closest_edge.V2;
        const V1_point = point_vertices[closest_edge_index.i1];
        const V2_point = point_vertices[closest_edge_index.i2];

        let circle_vertex;
        if(V2.subtract(V1)
            .perpendicular()
            .dot(P1.subtract(V1)) >= 0)
        {
            circle_vertex = contact_point.subtract(P1);
        }else{
            circle_vertex = P1.subtract(contact_point);
        }
        circle_vertex = circle_vertex.normalize().multiply(radius).add(P1);

        const correction_vector = contact_point.subtract(circle_vertex);

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
            polygon, 
            new_V1,
            normal.invert(),
            0
        );
        V2_point.applyCollision(
            polygon, 
            new_V2,
            normal.invert(),
            0
        );
        point.applyCollision(
            polygon,
            new_P1,
            normal,
            0
        );

        return true;
    }

    static isCircleIntersect(vertices, P1, radius){
        let closest_distance = Infinity;
        let closest_edge = null;
        let closest_edge_index = null;
        let contact_point = null;

        let is_intersect = false;

        Vector.edgeIterator(vertices, (V1, V2, i1, i2)=>{
            // vector 1 (first vertex to circle center)
            const v1 = P1.subtract(V1); 
            // vector 2 (vertex 1 to vertex 2)
            const v2 = V2.subtract(V1); 

            const mag = v2.magnitude();
            var scalar_proj_ratio = Math.max(
                Math.min(v1.dot(v2) / (mag * mag), 1), 0
            );//0 -> 1

            // vector to point projected 
            const v_to_p = v2.multiply(scalar_proj_ratio).add(V1);

            const d = Vector.distance(v_to_p, P1)
            if(d <= radius){
                if(d < closest_distance){
                    closest_distance = d;
                    is_intersect = true;
                    closest_edge = {V1, V2};
                    closest_edge_index = {i1, i2};
                    contact_point = v_to_p;
                }
            }
        });

        if(!is_intersect) return false;

        return {
            closest_edge,
            closest_edge_index,
            contact_point
        }
    }
}

export class PointPolygonCollider{
    static check(point, polygon){
        const P1 = point.position;
        const point_vertices = polygon.getPointsArray();
        const vertices = point_vertices.map((point)=> point.position);
        //TODO: check bound before here
        const bounds = Vector.getBounds(vertices);
        if(!Vector.isPointInBounds(P1, bounds)) return false;

        const P2 = new Vector(P1.x, bounds.uy + 5);

        const { 
            closest_edge,
            closest_edge_index, 
            contact_point 
        } = PointPolygonCollider.isPointInPolygon(vertices, P1, P2);

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
            polygon, 
            new_V1, 
            normal.invert(),
            polygon.friction_constant,
        );
        V2_point.applyCollision(
            polygon, 
            new_V2, 
            normal.invert(),
            polygon.friction_constant,
        );
        point.applyCollision(
            polygon,
            new_P1,
            normal,
            polygon.friction_constant,
        );

        return true;
    }

    static isPointInPolygon(vertices, P1, P2){
        let intersection_count = 0;
        let closest_distance = Infinity;
        let closest_edge = null;
        let closest_edge_index = null;
        let contact_point = null;

        Vector.edgeIterator(vertices, (V1, V2, i1, i2)=>{
            if(PointPolygonCollider.isSegmentIntersect(P1, P2, V1, V2)){
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

    static isSegmentIntersect(P1, P2, V1, V2) {
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

export class PointCircleCollider{
    static check(point, circle){
        const P1 = point.position;
        const circle_point = circle.getCenterPoint();
        const P2 = circle_point.position;
        const radius = circle.getRadius();

        //center of the circle to the point
        const P21 = P1.subtract(P2);
        const d = P21.magnitude();

        if(d > radius) return false;

        const normal = P21.normalize();
        const correction_vector = normal.multiply(radius-d); 

        const m1 = point.mass;
        const m2 = circle_point.mass;
        const sum_m = m1+m2;

        const correction_P1 = correction_vector.multiply(m2/sum_m);
        const correction_P2 = correction_vector.invert().multiply(m1/sum_m);

        point.applyCollision(
            circle,
            correction_P1.add(P1),
            normal,
            0
        );
        circle.getCenterPoint().applyCollision(
            point,
            correction_P2.add(P2),
            normal.invert(),
            0
        );

        return true;
}
}
