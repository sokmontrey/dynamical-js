export function Vector2(x=0, y=0){
    this.x = x;
    this.y = y;
}

/*
Static Methods
*/

Vector2.add = function(a, b){
    if(b instanceof Vector2) return new Vector2(a.x + b.x, a.y+b.y);
    else return new Vector2(a.x+b, a.y+b);
}
Vector2.subtract = function(a, b){
    if(b instanceof Vector2) return new Vector2(a.x-b.x, a.y-b.y);
    else return new Vector2(a.x-b, a.y-b);
}
Vector2.invert = function(a){
    return new Vector2(-a.x, -a.y);
}
Vector2.multiply = function(a, b){
    if(b instanceof Vector2) return new Vector2(a.x*b.x, a.y*b.y);
    else return new Vector2(a.x*b, a.y*b);
}
Vector2.divide = function(a, b){
    if(b instanceof Vector2) return new Vector2(a.x/b.x, a.y/b.y);
    else return new Vector2(a.x/b, a.y/b);
}
Vector2.dot = function(a, b){
    return a.x*b.x + a.y*b.y;
}
Vector2.magnitude = function(a){
    return Math.sqrt(a.x*a.x + a.y*a.y);
}
Vector2.normalize = function(a){
    const mag = Vector2.mag(a);
    return new Vector2(a.x/mag, a.y/mag);
}
Vector2.min = function(a,b){
    return new Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
}
Vector2.max= function(a,b){
    return new Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
}
Vector2.distance = function(a,b){
    return Vector2.magnitude(Vector2.subtract(a, b));
}
Vector2.clone = function(a){
    return new Vector2(a.x, a.y);
}
Vector2.assign = function(a, b){
    a.x = b.x;
    a.y = b.y;
}
Vector2.mirror = function(a, n){
    return Vector2.subtract(a,
        Vector2.multiply(
            2,
            Vector2.multiply( 
                n, 
                -n.y*a.x + n.x*a.y
            )
        )
    );
}

/*
Instance Methods
*/

Vector2.prototype = {
    add: function(other){
        return Vector2.add(this, other);
    },
    subtract: function(other){
        return Vector2.subtract(this, other);
    },
    invert: function(){
        return Vector2.invert(this);
    },
    multiply: function(other){
        return Vector2.multiply(this, other);
    },
    divide: function(other){
        return Vector2.divide(this, other);
    },
    dot: function(other){
        return Vector2.dot(this, other);
    },
    magnitude: function(){
        return Vector2.magnitude(this);
    },
    normalize: function(){
        return Vector2.normalize(this);
    },
    min: function(){
        return Vector2.min(this);
    },
    max: function(){
        return Vector2.max(this);
    },
    distance: function(other){
        return Vector2.distance(this, other);
    },
    clone: function(){
        return Vector2.clone(this);
    },
    assign: function(other){
        Vector2.assign(this, other);
    },
    mirror: function(n){
        return Vector2.mirror(this, n);
    },
};