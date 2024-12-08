import Mode from "./Mode.ts";
import MoveModeRenderer from "../renderer/MoveModeRenderer.ts";
import Canvas from "../core/Canvas.ts";

export default class MoveMode extends Mode {
    public renderer!: MoveModeRenderer;

    public init(): void {
        this.renderer = new MoveModeRenderer(this);
    }

    override onMouseMove(canvas: Canvas) {
        console.log("MoveMode: onMouseMove");
    }
}