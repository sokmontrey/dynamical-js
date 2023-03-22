import Renderer from './renderer.js';
import { Vector2 } from './util/vector.js';
import { RigidConstraint, CanvasConstraint } from './constraint.js';
import PointMass from './point_mass.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#233d4d');

const box = [
    new PointMass(renderer.CENTER.add(new Vector2(0, -100))),
    new PointMass(renderer.CENTER.add(new Vector2(100,0))),
    new PointMass(renderer.CENTER.add(new Vector2(0, 100))),
    new PointMass(renderer.CENTER.add(new Vector2(-100, 0))),
];
const box_structure = new RigidConstraint([...box, box[0], box[2]]);

const canvas_container = new CanvasConstraint( renderer.WIDTH, renderer.HEIGHT, box);

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    for(let i=0; i<box.length; i++){
        box[i].applyForce(new Vector2(0, 9.8 * box[i].mass));
    }

    for(let i=0; i<box.length; i++){
        box[i].updatePosition(delta_time * 0.01);
    }

    box_structure.check();
    canvas_container.check();

    renderer.polygon(box, {stroke: '#fcca46', stroke_width: 2});
});