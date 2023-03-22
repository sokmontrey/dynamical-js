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

            const cp = p2.add(p1).divide(2);

            const cp1 = cp.add(cp.subtract(p1).scaleMagnitudeTo(point1.radius));
            const cp2 = cp.add(cp.subtract(p2).scaleMagnitudeTo(point2.radius));

            point2.resolveCollision(cp1, n1);
            point1.resolveCollision(cp2, n2);
        }
    }
}

const p1 = new Point(renderer.CENTER.add(new Vector2(5,-50)), 20);
const p2 = new Point(renderer.CENTER.add(new Vector2(-5, 50)), 20);
const bound_box = new BoundBox(renderer.WIDTH, renderer.HEIGHT, renderer.CENTER);
const collision_constraint = new CollisionConstraint();

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    p1.applyForce(new Vector2(0, 9.8 * p1.mass));
    p2.applyForce(new Vector2(0, 9.8 * p2.mass));

    p1.updatePosition(delta_time * 0.01);
    p2.updatePosition(delta_time * 0.01);


    bound_box.checkPoint(p1);
    bound_box.checkPoint(p2);
    collision_constraint.checkCollision(p1, p2);

    c.fillStyle = '#e9c46a';
    renderer.point(p1.pos, p1.radius);
    c.fillStyle = '#e76f51';
    renderer.point(p2.pos, p2.radius);
});