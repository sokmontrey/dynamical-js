import Mode from "./Mode";

export default abstract class ModeRenderer {
    protected mode: Mode;

    public constructor(mode: Mode) {
        this.mode = mode;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}