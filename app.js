import Renderer from './render.js';
import { Circle } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);

const circle = new Circle(0,0, 50);
Render.render([circle], ()=>{}, 0);
