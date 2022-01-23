import Renderer from './render.js';
import { Circle, Line, SymPolygon } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);
Render.setShowBounds(true);

const circle = new Circle(0,0, 50);
const line = new Line(-100, 100, 100, -100);
const polygon = new SymPolygon(0,100, 50, 6);
Render.render([circle, line, polygon], ()=>{}, 0);
