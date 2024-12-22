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
    private static mouse_position: Vec2 = Vec2.zero();
    private static is_mouse_down: boolean = false;
    private static mouse_down_pos: Vec2 = Vec2.zero();
    private static holding_keys: Set<string> = new Set();

    private static mouse_move_handlers: Set<MousePositionHandler> = new Set();
    private static mouse_down_handlers: Set<MouseEventHandler> = new Set();
    private static mouse_up_handlers: Set<MouseEventHandler> = new Set();
    private static mouse_click_handlers: Set<MouseEventHandler> = new Set();

    private static initialized: boolean = false;

    private constructor() {} // Prevent instantiation

    static init(canvas: Canvas): void {
        if (InputManager.initialized) return;
        InputManager.initialized = true;

        InputManager.setupMouseEvents(canvas);
        InputManager.setupKeyboardEvents();
    }

    private static setupMouseEvents(canvas: Canvas): void {
        if (!canvas) return;

        canvas.onMouseMove((_e: MouseEvent) => {
            InputManager.mouse_position = canvas.getMousePosition();
            InputManager.notifyMouseMove();
        });

        canvas.onMouseDown((e: MouseEvent) => {
            if (InputManager.is_mouse_down) return;
            InputManager.is_mouse_down = true;
            InputManager.mouse_down_pos = InputManager.mouse_position;
            InputManager.notifyMouseDown(e);
        });

        canvas.onMouseUp((e: MouseEvent) => {
            if (!InputManager.is_mouse_down) return;
            InputManager.is_mouse_down = false;
            InputManager.notifyMouseUp(e);
            InputManager.notifyMouseClick(e);
        });
    }

    private static setupKeyboardEvents(): void {
        document.addEventListener('keydown', (e) => {
            InputManager.holding_keys.add(e.key);
        });

        document.addEventListener('keyup', (e) => {
            InputManager.holding_keys.delete(e.key);
        });
    }

    //================================ Notifiers ================================

    private static notifyMouseMove(): void {
        InputManager.mouse_move_handlers.forEach(handler => handler());
    }

    private static notifyMouseDown(e: MouseEvent): void {
        InputManager.mouse_down_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    private static notifyMouseUp(e: MouseEvent): void {
        InputManager.mouse_up_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    private static notifyMouseClick(e: MouseEvent): void {
        InputManager.mouse_click_handlers.forEach(handler => handler(e.button as MouseButton));
    }

    //================================ Event Subscribers ================================

    static onMouseMove(handler: MousePositionHandler): void {
        InputManager.mouse_move_handlers.add(handler);
    }

    static onMouseDown(handler: MouseEventHandler): void {
        InputManager.mouse_down_handlers.add(handler);
    }

    static onMouseUp(handler: MouseEventHandler): void {
        InputManager.mouse_up_handlers.add(handler);
    }

    static onMouseClick(handler: MouseEventHandler): void {
        InputManager.mouse_click_handlers.add(handler);
    }

    static removeMouseMoveHandler(handler: MousePositionHandler): void {
        InputManager.mouse_move_handlers.delete(handler);
    }

    static removeMouseDownHandler(handler: MouseEventHandler): void {
        InputManager.mouse_down_handlers.delete(handler);
    }

    static removeMouseUpHandler(handler: MouseEventHandler): void {
        InputManager.mouse_up_handlers.delete(handler);
    }

    static removeMouseClickHandler(handler: MouseEventHandler): void {
        InputManager.mouse_click_handlers.delete(handler);
    }

    //================================ State Getters ================================

    static getMousePosition(): Vec2 {
        return InputManager.mouse_position;
    }

    static getMouseDownPosition(): Vec2 {
        return InputManager.mouse_down_pos;
    }

    static isMouseDown(): boolean {
        return InputManager.is_mouse_down;
    }

    static isKeyDown(key: string): boolean {
        return InputManager.holding_keys.has(key);
    }

    //================================ Reset ================================

    static clear(): void {
        InputManager.mouse_position = Vec2.zero();
        InputManager.is_mouse_down = false;
        InputManager.mouse_down_pos = Vec2.zero();
        InputManager.holding_keys.clear();
        InputManager.mouse_move_handlers.clear();
        InputManager.mouse_down_handlers.clear();
        InputManager.mouse_up_handlers.clear();
        InputManager.mouse_click_handlers.clear();
    }
}