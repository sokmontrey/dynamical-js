import PhysicBodyState from "./PhysicBodyState.ts";

export default class DependencyManager {
    private static table: Map<string, Record<string, string>> = new Map();
    private static initialized: boolean = false;

    private constructor() {} // Prevent instantiation

    static init(state: PhysicBodyState): void {
        if (!DependencyManager.initialized) {
            DependencyManager.initialized = true;
        }
        DependencyManager.loadFromState(state);
    }

    /**
     * Child dependending on parents. 
     */
    static setDependency(child_name: string, parent: Record<string, string>): void {
        if (!DependencyManager.table.has(child_name)) {
            DependencyManager.table.set(child_name, parent);
        }
    }

    /**
     * Get all parents that the child depends on.
     */
    static getDependency(child_name: string): Record<string, string> | null {
        return DependencyManager.table.get(child_name) || null;
    }

    /**
     * Find all children that depend on the parent. 
     */
    static findChilds(parent_name: string): string[] {
        return Array.from(DependencyManager.table.entries())
            .filter(([_, parent]) => Object.values(parent).includes(parent_name))
            .map(([child]) => child);
    }

    private static loadFromState(state: PhysicBodyState): void {
        DependencyManager.clear();
        for(const key in state){
            DependencyManager.setDependency(key, state[key].dependencies || {});
        }
    }

    static clear(): void {
        DependencyManager.table.clear();
    }
}