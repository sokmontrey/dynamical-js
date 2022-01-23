import Renderer from './render.js';
import { Circle, Line, SymPolygon } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);

const circle = new Circle(0,0, 50, 16)
const line = new Line(-100, 100, 100, -100, 4, Math.PI/4);
const polygon = new SymPolygon(0,100, 50, 6);
Render.render([circle, line, polygon], ()=>{}, 0);
