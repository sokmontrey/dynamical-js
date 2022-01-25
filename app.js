import Renderer from './render.js';
import { Dot } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);
Render.setShowBounds(false);

const dot = new Dot(0, 0);
Render.render([dot], ()=>{}, 0);
