import Renderer from './render.js';
import { Dot, Rectangle, Circle } from './body.js';
import Enginer from './engine.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
text.id = 'text';
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);
Render.setShowBounds(false);

const rect = new Rectangle(0,-50,100,100);
const circle = new Circle(0,-50,20, 16);
const dot = new Dot(0,200,10);
const circle2 = new Circle(10, 100, 50, 16);

const Engine = new Enginer();
Engine.init(Render, [rect, circle]);
Engine.run();
Engine.stop = true;
