import Renderer from "../Renderer";
import EditorModeRenderer from "./EditorModeRenderer";

export default class EditorCreateModeRenderer extends EditorModeRenderer {
    draw(ctx: CanvasRenderingContext2D, steps: number): Renderer {
		return this;
    }
}
