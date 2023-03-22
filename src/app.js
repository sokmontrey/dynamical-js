import Renderer from './renderer.js';
import {Vector2} from './util/vector.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#232323');

class Point{
    constructor({x, y}, radius=10){
        this.pos = new Vector2(x,y);
        this.old_pos = new Vector2(x, y);
        this.velocity = new Vector2(0,0);
        this.acceleration = new Vector2(0,0);

        this.mass = 1;
        this.radius = radius;
    }

    applyForce(f){
        this.acceleration = this.acceleration.add(f.divide(this.mass));
    }
    resolveCollision(contact_point, normal){
        this.old_pos = this.pos.subtract(this.old_pos)
            .reflect(normal)
            .invert()
            .add(contact_point);

        this.pos.assign(contact_point);
    }

    updatePosition(delta_time){
        this.velocity = this.pos.subtract(this.old_pos);

        this.old_pos.assign(this.pos);

        this.pos = this.pos
            .add(this.velocity)
            .add(this.acceleration.multiply(delta_time * delta_time));

        this.acceleration.assign(new Vector2(0,0));
    }
}

class BoundBox{
    constructor(width, height, position){
        this.width = width;
        this.height = height;
        //anchor is at the center
        this.pos = position;
    }

    checkPoint(p){
        let contact_point = null;
        let n = null;
        if(p.pos.y > this.height - p.radius){
            n = new Vector2(0, -1);
            if(p.old_pos.isVertical(p.pos)){
                contact_point = new Vector2(p.pos.x, this.height-p.radius);
            }else{
                contact_point = new Vector2(
                    p.pos.x 
                    + (this.height-p.radius-p.pos.y) * (p.pos.x-p.old_pos.x) 
                    / (p.pos.y-p.old_pos.y),
                    this.height-p.radius
                )
            }
        } else if(p.pos.y < p.radius){
            n = new Vector2(0, 1);
            if(p.old_pos.isVertical(p.pos)){
                contact_point = new Vector2(p.pos.x, p.radius);
            }else{
                contact_point = new Vector2(
                    p.pos.x 
                    + (p.radius-p.pos.y) * (p.pos.x-p.old_pos.x) 
                    / (p.pos.y-p.old_pos.y),
                    p.radius
                )
            }
        }else if (p.pos.x < p.radius){
            n = new Vector2(1, 0);
            if(p.old_pos.isHorizontal(p.pos)){
                contact_point = new Vector2(p.radius, p.pos.y);
            }else{
                contact_point = new Vector2(
                    p.radius,
                    (p.pos.y - p.old_pos.y) * (p.radius - p.pos.x) 
                    / (p.pos.x - p.old_pos.x) + p.pos.y
                );
            }
        }else if(p.pos.x > this.width - p.radius){
            n = new Vector2(-1, 0);
            if(p.old_pos.isHorizontal(p.pos)){
                contact_point = new Vector2(this.width - p.radius, p.pos.y);
            }else{
                contact_point = new Vector2(
                    this.width - p.radius,
                    (p.pos.y - p.old_pos.y) * (this.width - p.radius - p.pos.x) 
                    / (p.pos.x - p.old_pos.x) + p.pos.y
                );
            }
        }
        //TODO: check vertical wall collision
        if(contact_point) p.resolveCollision(contact_point, n);
    }
}

const p = new Point(renderer.CENTER, 10);
const bound_box = new BoundBox(renderer.WIDTH, renderer.HEIGHT, renderer.CENTER);

p.applyForce(new Vector2(-50, 0))

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    p.applyForce(new Vector2(0, 9.8 * p.mass));
    bound_box.checkPoint(p);
    p.updatePosition(delta_time * 0.01);

    c.fillStyle = 'white';
    renderer.point(p.pos, p.radius);
});