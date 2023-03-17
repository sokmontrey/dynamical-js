function Vector2 (x=0, y=0){
    this.x = x;
    this.y = y;
}

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
/*
Vector2.mirror = (a, normal_vector)=>{

}

*/