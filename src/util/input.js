import { Vector } from './dynamical_vector.js';

export default class Input{
    constructor(renderer){
        this._renderer = renderer;
        this._control_axis = new Vector(null, null);
        this._mouse_position = new Vector(null, null);
        this._mouse_event = {
            "mousedown": false,
            "mouseup": true,
            "mousepress": ()=>{},
        };
    }

    listenMousePosition(){
        const canvas = this._renderer.canvas;
        canvas.addEventListener('mousemove', (e)=>{
            this._mouse_position.x = e.x - canvas.offsetLeft; 
            this._mouse_position.y = e.y - canvas.offsetTop;
        });
    }

    getMouseX(){
        return this._mouse_position.x;
    }
    getMouseY(){
        return this._mouse_position.y;
    }
    getMousePosition(){
        return this._mouse_position;
    }
}
