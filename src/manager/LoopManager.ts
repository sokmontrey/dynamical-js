export interface LoopParams {
    constant_dt?: number | null;
    sub_steps?: number;
}

export type UpdateFunction = (dt: number, sub_steps: number) => void;
export type RenderingFunction = (dt: number, sub_steps: number) => void;

export default class LoopManager {
    private static is_constant_dt: boolean = false;
    private static constant_dt: number = 0.16;
    private static is_running: boolean = false;
    private static sub_steps: number = 100;
    private static initialized: boolean = false;

    private static prev_time: number = 0;
    private static update_func?: UpdateFunction;
    private static rendering_func?: RenderingFunction;

    private static frame_id: number | null = null;
    private static frame_count: number = 0;

    private constructor() {} // Prevent instantiation

    static init(
        update_func: UpdateFunction,
        rendering_func: RenderingFunction,
        {
            constant_dt = null,
            sub_steps = 100,
        }: LoopParams = {}
    ): void {
        if (LoopManager.initialized) return;
        LoopManager.initialized = true;

        LoopManager.update_func = update_func;
        LoopManager.rendering_func = rendering_func;
        LoopManager.setConstantDeltaTime(constant_dt);
        LoopManager.sub_steps = sub_steps;
    }

    private static getDeltaTime(current_time: number): number {
        if (LoopManager.is_constant_dt) return LoopManager.constant_dt;
        const dt = Math.min((current_time - LoopManager.prev_time) / 10, 0.16);
        LoopManager.prev_time = current_time;
        return dt / LoopManager.sub_steps;
    }

    private static _update(current_time: number): void {
        if (!LoopManager.update_func || !LoopManager.rendering_func) return;

        const dt = LoopManager.getDeltaTime(current_time);
        LoopManager.frame_count++;
        
        for (let i = 0; i < LoopManager.sub_steps; i++) {
            LoopManager.update_func(dt, LoopManager.sub_steps);
        }
        
        LoopManager.rendering_func(dt, LoopManager.sub_steps);
        LoopManager.frame_id = window.requestAnimationFrame(LoopManager._update.bind(LoopManager));
    }

    static run(): number | null {
        if (LoopManager.is_running) return LoopManager.frame_id;
        LoopManager.is_running = true;
        LoopManager.frame_id = window.requestAnimationFrame(LoopManager._update.bind(LoopManager));
        return LoopManager.frame_id;
    }

    static pause(): void {
        LoopManager.is_running = false;
        if (LoopManager.frame_id === null) return;
        window.cancelAnimationFrame(LoopManager.frame_id);
    }

    static reset(): void {
        LoopManager.frame_count = 0;
    }

    /**
     * Invoke update function once. 
     * Can be called while the loop is running, but may cause anomaly.
     */
    static step(dt: number = 0.16): void {
        LoopManager.frame_count++;
        LoopManager.update(dt);
        LoopManager.render(dt);
    }

    static update(dt: number = 0.16): void {
        if (!LoopManager.update_func) return;
        if (dt <= 0) throw new Error("Delta time cannot be less than or equal to zero");
        
        for (let i = 0; i < LoopManager.sub_steps; i++) {
            LoopManager.update_func(dt / LoopManager.sub_steps, LoopManager.sub_steps);
        }
    }

    static render(dt: number = 0.16): void {
        if (!LoopManager.rendering_func) return;
        if (dt <= 0) throw new Error("Delta time cannot be less than or equal to zero");
        
        LoopManager.rendering_func(dt / LoopManager.sub_steps, LoopManager.sub_steps);
    }

    //================================ Getters ================================

    static getFrameCount(): number {
        return LoopManager.frame_count;
    }

    static isConstantDeltaTime(): boolean {
        return LoopManager.is_constant_dt;
    }

    static getConstantDeltaTime(): number {
        return LoopManager.constant_dt;
    }

    static getFrameId(): number | null {
        return LoopManager.frame_id;
    }

    static isRunning(): boolean {
        return LoopManager.is_running;
    }

    //================================ Setters ================================

    static setConstantDeltaTime(dt: number | null = null): void {
        LoopManager.is_constant_dt = false;
        LoopManager.constant_dt = 0.16;
        
        if (dt !== null) {
            if (dt <= 0) throw new Error("Constant delta time cannot be less than or equal to zero");
            LoopManager.is_constant_dt = true;
            LoopManager.constant_dt = dt;
        }
    }

    static setUpdateFunction(update_func: UpdateFunction): void {
        LoopManager.update_func = update_func;
    }

    static setRenderingFunction(rendering_func: RenderingFunction): void {
        LoopManager.rendering_func = rendering_func;
    }
} 