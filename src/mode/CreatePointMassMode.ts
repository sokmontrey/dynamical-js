import Mode from "./Mode.ts";
import CreatePointMassModeRenderer from "../renderer/CreatePointMassModeRenderer.ts";

export default class CreatePointMassMode extends Mode {
    public renderer!: CreatePointMassModeRenderer;

    public init() {
        this.renderer = new CreatePointMassModeRenderer(this);
    }
}