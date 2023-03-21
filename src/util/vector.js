export function Vector2(x=0, y=0){
    this.x = x;
    this.y = y;
}

/*
Static Methods
*/

Vector2.add = (a, b)=>{
    if(b instanceof Vector2) return new Vector2(a.x + b.x, a.y+b.y);
    else return new Vector2(a.x+b, a.y+b);
}
Vector2.subtract = (a, b)=>{
    if(b instanceof Vector2) return new Vector2(a.x-b.x, a.y-b.y);
    else return new Vector2(a.x-b, a.y-b);
}
Vector2.invert = (a)=>{
    return new Vector2(-a.x, -a.y);
}
Vector2.multiply = (a, b)=>{
    if(b instanceof Vector2) return new Vector2(a.x*b.x, a.y*b.y);
    else return new Vector2(a.x*b, a.y*b);
}
Vector2.divide = (a, b)=>{
    if(b instanceof Vector2) return new Vector2(a.x/b.x, a.y/b.y);
    else return new Vector2(a.x/b, a.y/b);
}
Vector2.dot = (a, b)=>{
    return a.x*b.x + a.y*b.y;
}
Vector2.magnitude = (a)=>{
    return Math.sqrt(a.x*a.x + a.y*a.y);
}
Vector2.normalize = (a)=>{
    const mag = Vector2.mag(a);
    return new Vector2(a.x/mag, a.y/mag);
}
Vector2.min = (a,b)=>{
    return new Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
}
Vector2.max= (a,b)=>{
    return new Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
}
Vector2.distance = (a,b)=>{
    return Vector2.magnitude(Vector2.subtract(a, b));
}
Vector2.clone = (a)=>{
    return new Vector2(a.x, a.y);
}
Vector2.mirror = (a, n)=>{
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
    add: (other)=>{
        return Vector2.add(this, other);
    },
    subtract: (other)=>{
        return Vector2.subtract(this, other);
    },
    invert: ()=>{
        return Vector2.invert(this);
    },
    multiply: (other)=>{
        return Vector2.multiply(this, other);
    },
    divide: (other)=>{
        return Vector2.divide(this, other);
    },
    dot: (other)=>{
        return Vector2.dot(this, other);
    },
    magnitude: ()=>{
        return Vector2.magnitude(this);
    },
    normalize: ()=>{
        return Vector2.normalize(this);
    },
    min: ()=>{
        return Vector2.min(this);
    },
    max: ()=>{
        return Vector2.max(this);
    },
    distance: (other)=>{
        return Vector2.distance(this, other);
    },
    clone: ()=>{
        return Vector2.clone(this);
    },
    mirror: (n)=>{
        return Vector2.mirror(this, n);
    },
};