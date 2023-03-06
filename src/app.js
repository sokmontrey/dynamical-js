import Renderer from './renderer.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#232323');
renderer.clear();

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    c.fillStyle='white';

    renderer.point(renderer.CENTER, 3, {});
});