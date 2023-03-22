import Renderer from './renderer.js';
import { Vector2 } from './util/vector.js';
import { RigidConstraint, CanvasConstraint } from './constraint.js';
import Point from './point.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#233d4d');


const box = [
    new Point(renderer.CENTER.add(new Vector2(0, -100)), 0),
    new Point(renderer.CENTER.add(new Vector2(100,0)), 0),
    new Point(renderer.CENTER.add(new Vector2(0, 100)), 0),
    new Point(renderer.CENTER.add(new Vector2(-100, 0)), 0),
];

const canvas_container = new CanvasConstraint( renderer.WIDTH, renderer.HEIGHT, box);

//TODO: better rigidConstraint constructor
const rigid_constraint = [
    new RigidConstraint(box[0], box[1]),
    new RigidConstraint(box[1], box[2]),
    new RigidConstraint(box[2], box[3]),
    new RigidConstraint(box[3], box[0]),
    new RigidConstraint(box[0], box[2]),
    new RigidConstraint(box[1], box[3]),
];

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    for(let i=0; i<box.length; i++){
        box[i].applyForce(new Vector2(0, 9.8 * box[i].mass));
    }

    for(let i=0; i<box.length; i++){
        box[i].updatePosition(delta_time * 0.01);
    }

    for(let i=0; i<rigid_constraint.length; i++){
        rigid_constraint[i].check();
    }

    canvas_container.check();

    renderer.polygon(box, {stroke: '#fcca46', stroke_width: 2});
});