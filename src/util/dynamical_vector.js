export class Vector{
    constructor(x=0, y=0, z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /*
    Static Methods
    */

    static add (a, b){
        if(b instanceof Vector) return new Vector(a.x + b.x, a.y+b.y, a.z+b.z);
        else return new Vector(a.x+b, a.y+b, a.z+b);
    }
    static subtract (a, b){
        if(b instanceof Vector) return new Vector(a.x-b.x, a.y-b.y, a.z-b.z);
        else return new Vector(a.x-b, a.y-b, a.z-b);
    }
    static invert (a){
        return new Vector(-a.x, -a.y, -a.z);
    }
    static multiply (a, b){
        if(b instanceof Vector) return new Vector(a.x*b.x, a.y*b.y, a.z*b.z);
        else return new Vector(a.x*b, a.y*b, a.z*b);
    }
    static divide (a, b){
        //TODO: divide by zero
        if(b instanceof Vector) return new Vector(a.x/b.x, a.y/b.y, a.z/b.z);
        else return new Vector(a.x/b, a.y/b, a.z/b);
    }
    static lerp(a, b, t){
        return Vector.add(a, Vector.subtract(b, a).multiply(t));
    }
    static reciprocal (a){
        //TODO: divide by zero
        return new Vector(1/a.x, 1/a.y, 1/a.z);
    }
    static dot (a, b){
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }
    static cross (a, b){
        return a.x * b.y - a.y * b.x;
    }
    static magnitude (a){
        return Math.sqrt((a.x*a.x) + (a.y*a.y) + (a.z*a.z));
    }
    static normalize (a){
        const mag = Vector.magnitude(a);
        return new Vector(a.x/mag, a.y/mag, a.z/mag);
    }
    static min (a,b){
        return new Vector(
            Math.min(a.x, b.x), 
            Math.min(a.y, b.y), 
            Math.min(a.z, b.z)
        );
    }
    static max(a,b){
        return new Vector(
            Math.max(a.x, b.x), 
            Math.max(a.y, b.y),
            Math.max(a.z, b.z)
        );
    }
    static distance (a,b){
        return Vector.magnitude(Vector.subtract(a, b));
    }
    static clone (a){
        return new Vector(a.x, a.y, a.z);
    }
    static assign (a, b){
        a.x = b.x;
        a.y = b.y;
        a.z = b.z;
    }
    static perpendicular(a){
        return new Vector(a.y, -a.x);
    }
    /*
    Find a reflection vector A with V as the mirror
        (imagine -A bound of surface of V)
    */
    static reflect (a, v){
        return Vector.subtract(a,
            Vector.multiply(
                Vector.multiply( 
                    v, 
                    Vector.dot(a, v)
                ),
                1
            )
        );
    }
    static cut (a, scalar){
        const l = Vector.magnitude(a);
        return Vector.multiply(a, (l - scalar) / l);
    }
    static expand (a, scalar){
        const l = Vector.magnitude(a);
        return Vector.multiply(a, (l + scalar) / l);
    }
    //Scalar the Vectorto a certain length keeping the same angle
    static scaleMagnitudeTo (a, scalar){
        const l = Vector.magnitude(a);
        return Vector.multiply(a, scalar / l);
    }
    static isEqual (a, b){
        if(b instanceof Vector) return a.x == b.x && a.y == b.y && a.z == b.y;
        else return a.x == b && a.y == b && a.z == b;
    }
    static slope(a, b){
        return (b.y - a.y)/(b.x - a.x);
    }

    static getLineIntersection(a, b, c, d){
        const m1 = (b.y-a.y)/(b.x-a.x);
        const m2 = (d.y-c.y)/(d.x-c.x);

        const result = new Vector(0,0);

        //use the formula: y - A.y = m (x - A.x)
        if(!isFinite(m1)){ //AB segment is a vertical segment
            // the second segment is also vertical. 
            if(!isFinite(m2)) return false; 
            result.x = a.x;
            result.y = m2 * (a.x - c.x) + c.y;
        }else if(!isFinite(m2)){ //CD segment is a vertical segment
            result.x = c.x;
            result.y = m1 * (c.x - a.x) + a.y;
        }else{ //None of the the segment is a vertical segment
            result.x = (a.y - c.y + m2 * c.x - m1 * a.x) / (m2 - m1);
            result.y = m1 * (result.x - a.x) + a.y;
        }

        return result;
    }

    static getBounds(vertices){
        const result = {
            lx:Number.MAX_VALUE, 
            ly:Number.MAX_VALUE, 
            ux:0, uy:0,
        };

        for(let i=0; i<vertices.length; i++){
            result.lx = Math.min(result.lx, vertices[i].x);
            result.ly = Math.min(result.ly, vertices[i].y);
            result.ux = Math.max(result.ux, vertices[i].x);
            result.uy = Math.max(result.uy, vertices[i].y);
        }
        return result;
    }

    static isPointInBounds(p , bounds){
        return p.x >= bounds.lx && p.x <= bounds.ux &&
        p.y >= bounds.ly && p.y <= bounds.uy;
    }
    static isPointOnSegment(P, Q, R){
        return R.x >= Math.min(P.x, Q.x) && R.x <= Math.max(P.x, Q.x) && R.y >= Math.min(P.y, Q.y) && R.y <= Math.max(P.y, Q.y);
    }

    static edgeIterator(vertices, callback){
        for(let i=0; i<vertices.length-1; i++){
            callback(vertices[i], vertices[i+1],
            i, i+1);
        }
        callback(vertices[vertices.length-1], vertices[0],
        vertices.length-1, 0);
    }
    static distancePointToSegment(P, V1, V2){
        const closest_point = Vector.closestPointOnSegment(P, V1, V2);
        return Vector.distance(P, closest_point);
    }
    static closestPointOnSegment(P, V1, V2){
        const edge_vector = Vector.subtract(V2, V1);
        const point_vector = Vector.subtract(P, V1);
        const t = Vector.dot(point_vector, edge_vector) / Vector.dot(edge_vector, edge_vector);

        if (t <= 0) {
            return V1;
        } else if (t >= 1) {
            return V2;
        } else {
            return Vector.add(V1, Vector.multiply(edge_vector, t));
        }
    }
    /*
    Instance Methods
    */

    add (other){
        return Vector.add(this, other);
    }
    subtract (other){
        return Vector.subtract(this, other);
    }
    invert (){
        return Vector.invert(this);
    }
    multiply (other){
        return Vector.multiply(this, other);
    }
    divide (other){
        return Vector.divide(this, other);
    }
    reciprocal (){
        return Vector.reciprocal(this);
    }
    dot (other){
        return Vector.dot(this, other);
    }
    cross( other ){
        return Vector.cross(this, other);
    }
    magnitude (){
        return Vector.magnitude(this);
    }
    normalize (){
        return Vector.normalize(this);
    }
    min (){
        return Vector.min(this);
    }
    max (){
        return Vector.max(this);
    }
    distance (other){
        return Vector.distance(this, other);
    }
    clone (){
        return Vector.clone(this);
    }
    assign (other){
        Vector.assign(this, other);
    }
    reflect (other){
        return Vector.reflect(this, other);
    }
    cut (scalar){
        return Vector.cut(this, scalar);
    }
    expand (scalar){
        return Vector.expand(this, scalar);
    }
    scaleMagnitudeTo (scalar){
        return Vector.scaleMagnitudeTo(this, scalar);
    }
    isEqual (other){
        return Vector.isEqual(this, other);
    }
    isVertical (other){
        return Vector.isVertical(this, other);
    }
    isHorizontal (other){
        return Vector.isHorizontal(this, other);
    }
}
