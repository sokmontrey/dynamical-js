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
                1.5
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

    static getLineIntersection(a, b, c, d){
        let slope1 = (b.y - a.y) / (b.x - a.x);
        let slope2 = (d.y - c.y) / (d.x - c.x);

        let x, y;

        //use the formula: y - A.y = m (x - A.x)
        if(!isFinite(slope1)){ //AB segment is a vertical segment
            // the second segment is also vertical. 
            if(!isFinite(slope2)) return false; 

            x = a.x;
            y = slope2 * (a.x - c.x) + c.y;
        }else if(!isFinite(slope2)){ //CD segment is a vertical segment
            x = c.x;
            y = slope1 * (c.x - a.x) + a.y;
        }else{ //None of the the segment is a vertical segment
            x = (a.y - c.y + slope2 * c.x - slope1 * a.x) / (slope2 - slope1);
            y = slope1 * (x - a.x) + a.y;
        }

        return new Vector(x, y);
    }

    static getSegmentIntersection(a, b, c, d){
        //resource: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
        const p = a;
        const q = c;
        const r = b.subtract(a);
        const s = d.subtract(c);

        const pq = q.subtract(p);
        const rxs = Vector.cross(r, s);

        const t = Vector.cross(pq, s) / rxs;
        const u = Vector.cross(pq, r) / rxs;

        if(
            rxs != 0 && 
            0 <= t && t <= 1 &&
            0 <= u && u <= 1
        ){
            return p.add(r.multiply(t));
        }

        return false;
    }

    static isSegmentIntersect(a, b, c, d){
        //resource: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
        const p = a;
        const q = c;
        const r = b.subtract(a);
        const s = d.subtract(c);

        const pq = q.subtract(p);
        const rxs = Vector.cross(r, s);

        const t = Vector.cross(pq, s) / rxs;
        const u = Vector.cross(pq, r) / rxs;

        return (
            rxs != 0 && 
            0 <= t && t <= 1 &&
            0 <= u && u <= 1
        );
    }

    // Pseudo
    static isPointBetweenSegment(p, a, b){
        return (
            Math.ceil(p.x) >= Math.min(a.x, b.x) &&
            Math.floor(p.x) <= Math.max(a.x, b.x) &&
            Math.ceil(p.y) >= Math.min(a.y, b.y) && 
            Math.floor(p.y) <= Math.max(a.y, b.y)
        );
    }

    static isPointBehindLine(p, a, n){
        //TODO: behind or on
        return p.subtract(a).dot(n) <= 0;
    }

    static isPointInfrontLine(p, a, n){
        return p.subtract(a).dot(n) >= 0;
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
