import Renderer from './render.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);

renderer.setBackground('#222222');
renderer.setUpdate((dt)=>{
    renderer.clear();
    renderer.setFill('#ffffff');
    renderer.point(200,200);
});