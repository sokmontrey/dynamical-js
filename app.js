import Renderer from './render.js';
import { Dot, Rectangle, Circle } from './body.js';
import Enginer from './engine.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);
Render.setShowBounds(false);

const dot = new Dot(0,0);
const rect = new Rectangle(100,0,100,100);
const circle = new Circle(100, 200, 50, 16);

const Engine = new Enginer();
Engine.init(Render, [dot, rect,circle]);
Engine.run();
Engine.stop = true;
