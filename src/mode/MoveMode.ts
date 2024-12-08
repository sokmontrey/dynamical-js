import Mode from "./Mode.ts";
import MoveModeRenderer from "../renderer/MoveModeRenderer.ts";
import Vec2 from "../utils/Vector.ts";
import {MouseButton} from "../core/Editor.ts";

export default class MoveMode extends Mode {
    public renderer!: MoveModeRenderer;

    public init(): void {
        this.renderer = new MoveModeRenderer(this);
    }

    onMouseClick(button: MouseButton, mouse_start_pos: Vec2): void {
        console.log("MoveMode.onMouseClick");
    }

    onMouseDrag(button: MouseButton, mouse_start_pos: Vec2, mouse_curr_pos: Vec2): void {
        console.log("MoveMode.onMouseDrag");
    }

    onMouseMove(): void { return; }
    onMouseDown(): void { return; }
    onMouseUp(): void { return; }
}