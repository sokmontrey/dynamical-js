import Mode from "../mode/Mode.ts";

export default abstract class ModeRenderer {
    protected mode: Mode;

    public constructor(mode: Mode) {
        this.mode = mode;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}