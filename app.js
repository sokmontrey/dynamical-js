import Renderer from './render.js';
import { Circle, Line } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);

const circle = new Circle(0,0, 50);
const line = new Line(-100, 100, 100, -100);
Render.render([circle, line], ()=>{}, 0);
