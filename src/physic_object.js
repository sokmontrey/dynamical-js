import { Graphic } from './renderer.js';
export default class PhysicObject{
    constructor(){
        this.name       = null;

        this.graphic    = new Graphic();
    }

    setRenderer(renderer){
        this.graphic.renderer = renderer;

        return this;
    }

    setName(name){
        this.name = name;

        return this;
    }
}
