import Renderer from './renderer.js';
import { Vector2 } from './util/vector.js';
import { RigidConstraint, BoxConstraint, SpringConstraint } from './constraint.js';
import PointMass from './point_mass.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#233d4d');

const square = [
    new PointMass(renderer.CENTER.add(new Vector2(0, -100))),
    new PointMass(renderer.CENTER.add(new Vector2(100,0))),
    new PointMass(renderer.CENTER.add(new Vector2(0, 100))),
    new PointMass(renderer.CENTER.add(new Vector2(-100, 0))),
];
const square_structure = new RigidConstraint([...square, square[0], square[2]]);

const canvas_container = new BoxConstraint( renderer.WIDTH, renderer.HEIGHT, square);

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    for(let i=0; i<square.length; i++){
        square[i].applyForce(new Vector2(0, 9.8 * square[i].mass));
    }

    for(let i=0; i<square.length; i++){
        square[i].updatePosition(delta_time * 0.01);
    }

    square_structure.check();
    canvas_container.check();

    renderer.polygon(square, {stroke: '#fcca46', stroke_width: 2});
});