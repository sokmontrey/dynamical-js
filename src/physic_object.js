import { Graphic } from './graphic.js';

export default class PhysicObject{
    constructor(){
        this.name       = null;

        this.graphic    = new Graphic();
    }

    setGraphic(graphic_object){
        this.graphic = graphic_object;

        return this;
    }

    getGraphic(){
        return this.graphic;
    }

    setName(name){
        this.name = name;

        return this;
    }
}
