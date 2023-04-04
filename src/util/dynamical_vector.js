class Vector2{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }

    /*
    Static Methods
    */

    static add (a, b){
        if(b instanceof Vector2) return new Vector2(a.x + b.x, a.y+b.y);
        else return new Vector2(a.x+b, a.y+b);
    }
    static subtract (a, b){
        if(b instanceof Vector2) return new Vector2(a.x-b.x, a.y-b.y);
        else return new Vector2(a.x-b, a.y-b);
    }
    static invert (a){
        return new Vector2(-a.x, -a.y);
    }
    static multiply (a, b){
        if(b instanceof Vector2) return new Vector2(a.x*b.x, a.y*b.y);
        else return new Vector2(a.x*b, a.y*b);
    }
    static divide (a, b){
        if(b instanceof Vector2) return new Vector2(a.x/b.x, a.y/b.y);
        else return new Vector2(a.x/b, a.y/b);
    }
    static reciprocal (a){
        return new Vector2(1/a.x, 1/a.y);
    }
    static dot (a, b){
        return a.x*b.x + a.y*b.y;
    }
    static magnitude (a){
        return Math.sqrt(a.x*a.x + a.y*a.y);
    }
    static normalize (a){
        const mag = Vector2.magnitude(a);
        return new Vector2(a.x/mag, a.y/mag);
    }
    static min (a,b){
        return new Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    static max(a,b){
        return new Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    static distance (a,b){
        return Vector2.magnitude(Vector2.subtract(a, b));
    }
    static clone (a){
        return new Vector2(a.x, a.y);
    }
    static assign (a, b){
        a.x = b.x;
        a.y = b.y;
    }
    /*
    Find a reflection vector A with V as the mirror
        (imagine -A bound of surface of V)
    */
    static reflect (a, v){
        return Vector2.subtract(a,
            Vector2.multiply(
                Vector2.multiply( 
                    v, 
                    Vector2.dot(a, v)
                ),
                2
            )
        );
    }
    static cut (a, scalar){
        const l = Vector2.magnitude(a);
        return Vector2.multiply(a, (l - scalar) / l);
    }
    static expand (a, scalar){
        const l = Vector2.magnitude(a);
        return Vector2.multiply(a, (l + scalar) / l);
    }
    //Scalar the Vector2 to a certain length keeping the same angle
    static scaleMagnitudeTo (a, scalar){
        const l = Vector2.magnitude(a);
        return Vector2.multiply(a, scalar / l);
    }
    static isEqual (a, b){
        if(b instanceof Vector2) return a.x == b.x && a.y == b.y;
        else return a.x == b && a.y == b;
    }
    static isVertical (a, b){
        return a.x == b.x;
    }
    static isHorizontal(a, b){
        return a.y == b.y;
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

        return new Vector2(x, y);
    }
    // static isPointBetweenSegment(p, a, b){
    //     return (
    //         p.x >= Math.min(a.x, b.x) &&
    //         p.x <= Math.max(a.x, b.x) &&
    //         p.y >= Math.min(a.y, b.y) &&
    //         p.y <= Math.max(a.y, b.y)
    //     );
    // }

    static isPointBehindLine(p, a, n){
        //TODO: behind or on
        return p.subtract(a).dot(n) <= 0;
    }

    static isPointInfrontLine(p, a, n){
        return p.subtract(a).dot(n) > 0;
    }

    /*
    Instance Methods
    */

    add (other){
        return Vector2.add(this, other);
    }
    subtract (other){
        return Vector2.subtract(this, other);
    }
    invert (){
        return Vector2.invert(this);
    }
    multiply (other){
        return Vector2.multiply(this, other);
    }
    divide (other){
        return Vector2.divide(this, other);
    }
    reciprocal (){
        return Vector2.reciprocal(this);
    }
    dot (other){
        return Vector2.dot(this, other);
    }
    magnitude (){
        return Vector2.magnitude(this);
    }
    normalize (){
        return Vector2.normalize(this);
    }
    min (){
        return Vector2.min(this);
    }
    max (){
        return Vector2.max(this);
    }
    distance (other){
        return Vector2.distance(this, other);
    }
    clone (){
        return Vector2.clone(this);
    }
    assign (other){
        Vector2.assign(this, other);
    }
    reflect (other){
        return Vector2.reflect(this, other);
    }
    cut (scalar){
        return Vector2.cut(this, scalar);
    }
    expand (scalar){
        return Vector2.expand(this, scalar);
    }
    scaleMagnitudeTo (scalar){
        return Vector2.scaleMagnitudeTo(this, scalar);
    }
    isEqual (other){
        return Vector2.isEqual(this, other);
    }
    isVertical (other){
        return Vector2.isVertical(this, other);
    }
    isHorizontal (other){
        return Vector2.isHorizontal(this, other);
    }
}
