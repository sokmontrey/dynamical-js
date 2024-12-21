import PhysicBodyState from "./PhysicBodyState.ts";

export default class DependencyManager {
    private table: Map<string, Record<string, string>> = new Map();

    constructor() {
        this.clear();
    }

    /**
     * Child dependending on parents. 
     */
    setDependency(child_name: string, parent: Record<string, string>) {
        if (!this.table.has(child_name)) this.table.set(child_name, parent);
    }

    /**
     * Get all parents that the child depends on.
     */
    getDependency(child_name: string): Record<string, string> | null {
        return this.table.get(child_name) || null;
    }

    /**
     * Find all children that depend on the parent. 
     */
    findChilds(parent_name: string) {
        return Array.from(this.table.entries())
            .filter(([_, parent]) => Object.values(parent).includes(parent_name))
            .map(([child]) => child);
    }

    loadFromState(state: PhysicBodyState): void {
        this.clear();
        for(const key in state){
            this.setDependency(key, state[key].dependencies || {});
        }
    }

    clear(): void {
        this.table.clear();
    }
}