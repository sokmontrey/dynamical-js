import CircularKinematic from "@/body/circular-kinematic/Body";
import PointMass from "@/body/point-mass/Body";
import RigidConstraint from "@/body/rigid-constraint/Body";
import Body, { BodyType } from "@/core/Body";
import Vec2 from "@/utils/Vector";

type TreeChangeCallback = (body_ids: string[]) => void;

export default class BodyManager {
	private static bodies: Record<string, Body<any, any>> = {};
	private static dependency_table: Map<string, string[]> = new Map();
	private static on_tree_change: TreeChangeCallback = () => {};

	private static seed: number = 0;
	private static initialized: boolean = false;

	private static state: any = {};

	private constructor() {} // Prevent instantiation

	static init(): void {
		if (!BodyManager.initialized) {
			BodyManager.initialized = true;
		}
	}

	static setOnTreeChange(callback: TreeChangeCallback): void {
		BodyManager.on_tree_change = callback;
	}

	static removeBody(body_id: string): void {
		if (!body_id) return;
		const dependent_ids = BodyManager.getDependentBodies(body_id);
		dependent_ids.forEach(dependent_id => BodyManager.removeBody(dependent_id));
		const body = BodyManager.getById(body_id);
		if (!body) return;
		delete BodyManager.bodies[body_id];
		BodyManager.dependency_table.delete(body_id);
		BodyManager.on_tree_change(BodyManager.getAllBodyIds());
	}

	// ============================== Getters ==============================

	static getId(body: Body<any, any>): string | undefined {
		return Object.keys(BodyManager.bodies).find(key => BodyManager.bodies[key] === body);
	}

	static getById(id: string): Body<any, any> | null {
		return BodyManager.bodies[id] || null;
	}

	static getAllBodies(): Body<any, any>[] {
		return Object.values(BodyManager.bodies);
	}

	static getHoveredBodies(pos: Vec2): Body<any, any>[] {
		return Object
			.values(BodyManager.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	static getSelectedBodies(lower: Vec2, upper: Vec2): Body<any, any>[] {
		return Object
			.values(BodyManager.bodies)
			.filter(x => !x.interactor.isLocked() 
				&& x.interactor.isSelected(lower, upper));
	}

	static getAllBodyIds(): string[] {
		return Object.keys(BodyManager.bodies);
	}

	static toJSON(): any {
		const json = Object.fromEntries(
			Object.entries(BodyManager.bodies)
				.map(([id, body]) => [ id, body.toJSON() ])
		);
		return JSON.parse(JSON.stringify(json));
	}

	// ============================== Loaders ==============================

	static loadFromJSON(setting: any): void {
		BodyManager.clear();
		BodyManager.state = Vec2.deserializeVectorOnObject(setting);
		for(const [id] of Object.entries(BodyManager.state)) {
			BodyManager.processConfig(id);
		}
	}

	static loadFromJSONFile(file: File): void {
		const reader = new FileReader();
		reader.onload = (e) => {
			BodyManager.loadFromJSON(e.target?.result);
		};
		reader.readAsText(file);
	}

	static processDependency(config: any): any {
		if (config.dependencies) {
			const dep = Object.fromEntries(Object.entries(config.dependencies).map(([id, dep_id]) =>
				[id, BodyManager.processConfig(dep_id as string)]
			));
			config = { ...config, ...dep };
		}
		return config;
	}

	static processConfig(id: string): Body<any, any> {
		if (BodyManager.bodies[id]) return BodyManager.bodies[id];
		if (!BodyManager.state[id]) throw new Error(`Body ${id} not found in state`);
		const config = BodyManager.processDependency(BodyManager.state[id]);
		if (!config.type) throw new Error(`Body ${id} has no type`);

		const creator: Record<BodyType, new (config: any) => Body<any, any>> = {
			[BodyType.POINT_MASS]: PointMass,
			[BodyType.RIGID_CONSTRAINT]: RigidConstraint,
			[BodyType.CIRCULAR_KINEMATIC]: CircularKinematic,
		}

		const body = new creator[config.type as BodyType](config);
		BodyManager.addBody(body, id);
		return body;
	}

	static clear(): void {
		BodyManager.bodies = {};
		BodyManager.dependency_table.clear();
		BodyManager.seed = 0;
		BodyManager.state = {};
	}

	// ============================== Body dependency ==============================

	private static setDependency(child_id: string, parent: string[]): void {
		BodyManager.dependency_table.set(child_id, parent);
	}

	private static getDependentBodies(parent_id: string): string[] {
		return Array.from(BodyManager.dependency_table.entries())
			.filter(([_, deps]) => deps.includes(parent_id))
			.map(([child_id]) => child_id);
	}

	// ============================== Body creation ==============================

	static addBody(body: Body<any, any>, id: string = ""): Body<any, any> {
		id = id || body.getType().toString() + BodyManager.seed;
		body.setId(id);
		BodyManager.bodies[id] = body;
		BodyManager.seed++;
		BodyManager.setDependency(id, body.getDependencies());
		BodyManager.on_tree_change(BodyManager.getAllBodyIds());
		return body;
	}

	// ============================== Body update ==============================

	static updateConnectedConstraints(pointmass: PointMass): void {
		const pm_name = pointmass.getId();
		if (!pm_name) throw new Error("Pointmass has no id");
		
		BodyManager.getDependentBodies(pm_name)
			.map(child => BodyManager.getById(child))
			.filter((child): child is RigidConstraint => 
				child !== null && child.getType() === BodyType.RIGID_CONSTRAINT)
			.forEach(rigid => rigid.calculateRestDistance());
	}
}
