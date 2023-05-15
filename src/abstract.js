export default class Abstract{
    constructor(){
        this._name      = null;
        this._renderer  = null;
    }

    setRenderer(renderer){
        this._renderer = renderer;
        return this;
    }
    setName(name){
        this._name = name;
        return this;
    }
    
    get name(){
        return this._name;
    }
}
