import Renderer from "../Renderer";

export default class EditorCreateModeRenderer implements Renderer {
    draw(ctx: CanvasRenderingContext2D, steps: number): Renderer {
		return this;
    }
}
