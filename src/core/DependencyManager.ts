import PhysicBodyState from "./PhysicBodyState.ts";
import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import RigidConstraintConfig from "../config/RigidConstraintConfig.ts";

export default class DependencyManager {
    private table: Map<string, {[key: string]: string}>;

    constructor() {
        this.table = new Map();
    }

    setDependency(child_name: string, parent: {[key: string]: string}) {
        if (!this.table.has(child_name)) this.table.set(child_name, parent);
    }

    getDependency(child_name: string): {[key: string]: string} | null {
        return this.table.get(child_name) || null;
    }

    static fromState(state: PhysicBodyState): DependencyManager {
        const manager = new DependencyManager();
        for(const key in state){
            const config = state[key];
            switch (config.type) {
                case PhysicBodyType.RIGID_CONSTRAINT:
                    manager.setDependency(key, (config as RigidConstraintConfig).dependencies);
                    break;
            }
        }
        return manager;
    }
}