import Mode from "./Mode.ts";
import MoveModeRenderer from "../renderer/MoveModeRenderer.ts";
import Canvas from "../core/Canvas.ts";
import Vec2 from "../utils/Vector.ts";

export default class MoveMode extends Mode {
    public renderer!: MoveModeRenderer;

    public init(): void {
        this.renderer = new MoveModeRenderer(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseMove(_canvas: Canvas): void {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseDown(_canvas: Canvas): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseUp(_canvas: Canvas): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseDrag(_button: number, _mouse_start_pos: Vec2, _mouse_curr_pos: Vec2, _canvas: Canvas): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseClick(_button: number, _mouse_start_pos: Vec2, _canvas: Canvas): void {
        return;
    }
}