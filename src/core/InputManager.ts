import Canvas from "./Canvas";
import Vec2 from "../utils/Vector";

export enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}

type MouseEventHandler = (button: MouseButton) => void;
type MousePositionHandler = () => void;

export default class InputManager {
    private static instance: InputManager;
    
    private mouse_position: Vec2 = Vec2.zero();
    private is_mouse_down: boolean = false;
    private mouse_down_pos: Vec2 = Vec2.zero();
    private holding_keys: Set<string> = new Set();

    private mouse_move_handlers: Set<MousePositionHandler> = new Set();
    private mouse_down_handlers: Set<MouseEventHandler> = new Set();
    private mouse_up_handlers: Set<MouseEventHandler> = new Set();
    private mouse_click_handlers: Set<MouseEventHandler> = new Set();

    private constructor() {
        this.setupKeyboardEvents();
    }

    static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    static init(canvas: Canvas): void {
        const instance = InputManager.getInstance();
        instance.setupMouseEvents(canvas);
    }

    private setupMouseEvents(canvas: Canvas): void {
        if (!canvas) return;

        canvas.onMouseMove((_e: MouseEvent) => {
            this.mouse_position = canvas.getMousePosition();
            this.notifyMouseMove();
        });

        canvas.onMouseDown((e: MouseEvent) => {
            if (this.is_mouse_down) return;
            this.is_mouse_down = true;
            this.mouse_down_pos = this.getMousePosition();
            this.notifyMouseDown(e);
        });

        canvas.onMouseUp((e: MouseEvent) => {
            if (!this.is_mouse_down) return;
            this.is_mouse_down = false;
            this.notifyMouseUp(e);
            this.notifyMouseClick(e);
        });
    }

    private setupKeyboardEvents(): void {
        document.addEventListener('keydown', (e) => {
            this.holding_keys.add(e.key);
        });

        document.addEventListener('keyup', (e) => {
            this.holding_keys.delete(e.key);
        });
    }

    //================================ Notifiers ================================

    private notifyMouseMove(): void {
        this.mouse_move_handlers.forEach(handler => handler());
    }

    private notifyMouseDown(e: MouseEvent): void {
        this.mouse_down_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    private notifyMouseUp(e: MouseEvent): void {
        this.mouse_up_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    private notifyMouseClick(e: MouseEvent): void {
        this.mouse_click_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    //================================ Event Subscribers ================================

    onMouseMove(handler: MousePositionHandler): void {
        this.mouse_move_handlers.add(handler);
    }

    onMouseDown(handler: MouseEventHandler): void {
        this.mouse_down_handlers.add(handler);
    }

    onMouseUp(handler: MouseEventHandler): void {
        this.mouse_up_handlers.add(handler);
    }

    onMouseClick(handler: MouseEventHandler): void {
        this.mouse_click_handlers.add(handler);
    }

    removeMouseMoveHandler(handler: MousePositionHandler): void {
        this.mouse_move_handlers.delete(handler);
    }

    removeMouseDownHandler(handler: MouseEventHandler): void {
        this.mouse_down_handlers.delete(handler);
    }

    removeMouseUpHandler(handler: MouseEventHandler): void {
        this.mouse_up_handlers.delete(handler);
    }

    removeMouseClickHandler(handler: MouseEventHandler): void {
        this.mouse_click_handlers.delete(handler);
    }

    //================================ State Getters ================================

    getMousePosition(): Vec2 {
        return this.mouse_position;
    }

    getMouseDownPosition(): Vec2 {
        return this.mouse_down_pos;
    }

    isMouseDown(): boolean {
        return this.is_mouse_down;
    }

    isKeyDown(key: string): boolean {
        return this.holding_keys.has(key);
    }

    //================================ Reset ================================

    clear(): void {
        this.mouse_position = Vec2.zero();
        this.is_mouse_down = false;
        this.mouse_down_pos = Vec2.zero();
        this.holding_keys.clear();
        this.mouse_move_handlers.clear();
        this.mouse_down_handlers.clear();
        this.mouse_up_handlers.clear();
        this.mouse_click_handlers.clear();
    }
}