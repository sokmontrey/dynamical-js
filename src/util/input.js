import { Vector } from './dynamical_vector.js';

export default class Input{
    constructor(renderer){
        this._renderer = renderer;

        this._mouse_position = new Vector(null, null);
        this._is_mousedown = false;
        this._mouse_button = {};
    }

    listenMousePosition(){
        const renderer = this._renderer;
        const canvas = renderer.canvas;
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            this._mouse_position.x = (e.clientX-rect.left) 
                * renderer._camera_fov.x 
                + renderer._camera_position.x; 

            this._mouse_position.y = (e.clientY-rect.top) 
                * renderer._camera_fov.y 
                + renderer._camera_position.y; 
        });
    }

    listenMouseButton(){
        const canvas = this._renderer.canvas;
        canvas.addEventListener('mousedown', (e)=>{
            this._is_mousedown = true;
            this._mouse_button[e.buttons] = true;
            this.onMousePress(e);
        });
        canvas.addEventListener('mouseup', (e)=>{
            this._is_mousedown = false;
            this._mouse_button = {};
        });
    }
    onMousePress(){}

    getMouseX(){
        return this._mouse_position.x;
    }
    getMouseY(){
        return this._mouse_position.y;
    }
    getMousePosition(){
        return this._mouse_position;
    }
    get mouse_position() { return this._mouse_position; }
    get is_mousedown() { return this._is_mousedown; }
    get mouse_button() { return this._mouse_button; }
}
