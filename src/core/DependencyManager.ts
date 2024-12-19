import PhysicBodyState from "./PhysicBodyState.ts";

export default class DependencyManager {
    private table: Map<string, {[key: string]: string}>;

    constructor() {
        this.table = new Map();
    }

    /**
     * Child dependending on parents. 
     */
    setDependency(child_name: string, parent: {[key: string]: string}) {
        if (!this.table.has(child_name)) this.table.set(child_name, parent);
    }

    /**
     * Get all parents that the child depends on.
     */
    getDependency(child_name: string): {[key: string]: string} | null {
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

    static fromState(state: PhysicBodyState): DependencyManager {
        const manager = new DependencyManager();
        for(const key in state){
            manager.setDependency(key, state[key].dependencies || {});
        }
        return manager;
    }
}