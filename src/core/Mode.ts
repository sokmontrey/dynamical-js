import { MouseButton } from "@/manager/InputManager";
import ModeRenderer from "./ModeRenderer";

export default abstract class Mode {
    public abstract renderer: ModeRenderer;

    onMouseMove(): void { return; }

    onMouseDown(_button: MouseButton): void { return; }

    onMouseUp(_button: MouseButton): void { return; }

    onMouseClick(_button: MouseButton): void { return; }
}