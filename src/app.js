import Renderer from './renderer.js';
import {Vector2} from './util/vector.js';
import Point from './point.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#264653');

class BoundBox{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }

    checkPoint(p){
        let contact_point = null;
        let n = null;
        if(p.pos.y > this.height){
            n = new Vector2(0, -1);
            if(p.old_pos.isVertical(p.pos)){
                contact_point = new Vector2(p.pos.x, this.height);
            } else{
                contact_point = new Vector2(
                    p.pos.x 
                    + (this.height-p.pos.y) * (p.pos.x-p.old_pos.x) 
                    / (p.pos.y-p.old_pos.y),
                    this.height
                )
            }
        } else if(p.pos.y < 0){
            n = new Vector2(0, 1);
            if(p.old_pos.isVertical(p.pos)){
                contact_point = new Vector2(p.pos.x, 0);
            }else{
                contact_point = new Vector2(
                    p.pos.x 
                    + (-p.pos.y) * (p.pos.x-p.old_pos.x) 
                    / (p.pos.y-p.old_pos.y),
                    0
                )
            }
        }else if (p.pos.x < 0){
            n = new Vector2(1, 0);
            if(p.old_pos.isHorizontal(p.pos)){
                contact_point = new Vector2(0, p.pos.y);
            }else{
                contact_point = new Vector2(
                    0,
                    (p.pos.y - p.old_pos.y) * (p.pos.x) 
                    / (p.pos.x - p.old_pos.x) + p.pos.y
                );
            }
        }else if(p.pos.x > this.width){
            n = new Vector2(-1, 0);
            if(p.old_pos.isHorizontal(p.pos)){
                contact_point = new Vector2(this.width, p.pos.y);
            }else{
                contact_point = new Vector2(
                    this.width,
                    (p.pos.y - p.old_pos.y) * (this.width- p.pos.x) 
                    / (p.pos.x - p.old_pos.x) + p.pos.y
                );
            }
        }
        //TODO: check vertical wall collision
        if(contact_point) p.resolveCollision(contact_point, n);
    }
}

class CollisionConstraint{
    constructor(){}
    checkCollision(point1, point2){
        const p1 = point1.pos;
        const p2 = point2.pos;

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

class RigidConstraint{
    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
        this.l = Vector2.distance(point1.pos, point2.pos);
    }
    check(){
        const p1 = this.point1.pos;
        const p2 = this.point2.pos;

        let cp1, cp2;

        const new_l = Vector2.distance(p1, p2);

        if(new_l > this.l){
            const temp_cp = p2.subtract(p1).scaleMagnitudeTo((new_l - this.l)/2);

            cp1 = p1.add(temp_cp);
            cp2 = p2.add(temp_cp.invert());
        }else if(new_l < this.l){
            const temp_cp = p2.subtract(p1).scaleMagnitudeTo((new_l - this.l)/2);

            cp1 = p1.add(temp_cp);
            cp2 = p2.add(temp_cp.invert());
        }

        if(cp1){
            this.point1.resolveRigidConstraint(cp1);
            this.point2.resolveRigidConstraint(cp2);
        }
    }
}

const p = [
    new Point(renderer.CENTER.add(new Vector2(0, -100)), 10),
    new Point(renderer.CENTER.add(new Vector2(100,0)), 10),
    new Point(renderer.CENTER.add(new Vector2(0, 100)), 10),
    new Point(renderer.CENTER.add(new Vector2(-100, 0)), 10),
];

const bound_box = new BoundBox(renderer.WIDTH, renderer.HEIGHT, renderer.CENTER);
const collision_constraint = new CollisionConstraint();

const rigid_constraint = [
    new RigidConstraint(p[0], p[1]),
    new RigidConstraint(p[1], p[2]),
    new RigidConstraint(p[2], p[3]),
    new RigidConstraint(p[3], p[0]),
    new RigidConstraint(p[0], p[2]),
    new RigidConstraint(p[1], p[3]),
];

p[0].applyForce(new Vector2(50, 0))

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    for(let i=0; i<p.length; i++){
        p[i].applyForce(new Vector2(0, 9.8 * p[i].mass));
    }

    for(let i=0; i<p.length; i++){
        p[i].updatePosition(delta_time * 0.01);
    }

    for(let i=0; i<rigid_constraint.length; i++){
        rigid_constraint[i].check();
    }

    for(let i=0; i<p.length; i++){
        bound_box.checkPoint(p[i]);
    }

    c.fillStyle = '#e9c46a';
    for(let i=0; i<p.length; i++){
        renderer.point(p[i].pos, p[i].radius);
    }
});