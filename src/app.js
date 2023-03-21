import Renderer from './renderer.js';
import {Vector2} from './util/vector.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#232323');

renderer.update(({delta_time, context:c})=>{
    renderer.clear();
});