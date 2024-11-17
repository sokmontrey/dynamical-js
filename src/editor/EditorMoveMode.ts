import Vec2 from "../utils/math/Vector";
import { MouseButton } from "./Editor";
import EditorMode from "./EditorMode";

export default class EditorMoveMode extends EditorMode {
    onClick(button: MouseButton, pos: Vec2): void {
        throw new Error("Method not implemented.");
    }
    onDrag(button: MouseButton, lower: Vec2, upper: Vec2): void {
        throw new Error("Method not implemented.");
    }
}
