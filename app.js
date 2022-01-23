import Renderer from './render.js';
import { Polygon, Rectangle } from './body.js';

const canvasContainer = document.createElement('div');
document.body.appendChild(canvasContainer);

const text = document.createElement('h3');
document.body.appendChild(text);

const Render = new Renderer();
Render.init(canvasContainer, 600,600);
Render.setWireFrame(false);

const rect = new Rectangle(0, 0, 100, 100);
const polygon = new Polygon([
	//create set of point that create star shape width {x: 0, y: 0} as center
	{x: -100, y: 0},
	{x: -50, y: 0},
	{x: 0, y: 100},
	{x: 50, y: 0},
	{x: 100, y: 0},
	{x: 0, y: -100}
]);

