import Vec2 from "../utils/Vector.ts";
import RigidConstraint from "../core-physic/RigidConstraint.ts";
import PointMassRenderer from "../body-renderer/PointMassRenderer.ts";
import RigidConstraintRenderer from "../body-renderer/RigidConstraintRenderer.ts";
import PhysicBodyState, { PhysicBodyConfig } from "../core/PhysicBodyState.ts";
import PhysicBody, { PhysicBodyType } from "../core-physic/PhysicBody.ts";
import PointMass from "../core-physic/PointMass.ts";
import CircularKinematic from "../core-physic/CircularKinematic.ts";
import CircularKinematicRenderer from "../body-renderer/CircularKinematicRenderer.ts";

type TreeChangeCallback = (body_ids: string[]) => void;

export default class PhysicBodyManager {
	private static bodies: Record<string, PhysicBody> = {};
	private static seed: number = 0;
	private static initialized: boolean = false;
	private static dependency_table: Map<string, Record<string, string>> = new Map();
	private static on_tree_change: TreeChangeCallback = () => {};

	private constructor() {} // Prevent instantiation

	static init(state: PhysicBodyState): void {
		if (!PhysicBodyManager.initialized) {
			PhysicBodyManager.initialized = true;
		}
		PhysicBodyManager.loadFromState(state);
	}

	static setOnTreeChange(callback: TreeChangeCallback): void {
		PhysicBodyManager.on_tree_change = callback;
	}

	static removeBody(body_id: string): void {
		if (!body_id) return;
		const dependent_ids = PhysicBodyManager.getDependentBodies(body_id);
		dependent_ids.forEach(dependent_id => PhysicBodyManager.removeBody(dependent_id));
		const body = PhysicBodyManager.getById(body_id);
		if (!body) return;
		delete PhysicBodyManager.bodies[body_id];
		PhysicBodyManager.dependency_table.delete(body_id);
		PhysicBodyManager.on_tree_change(PhysicBodyManager.getAllBodyIds());
	}

	// ============================== Getters ==============================

	static getId(body: PhysicBody): string | undefined {
		return Object.keys(PhysicBodyManager.bodies).find(key => PhysicBodyManager.bodies[key] === body);
	}

	static getById(id: string): PhysicBody | null {
		return PhysicBodyManager.bodies[id] || null;
	}

	static getAllBodies(): PhysicBody[] {
		return Object.values(PhysicBodyManager.bodies);
	}

	static getHoveredBodies(pos: Vec2): PhysicBody[] {
		return Object
			.values(PhysicBodyManager.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	static getSelectedBodies(lower: Vec2, upper: Vec2): PhysicBody[] {
		return Object
			.values(PhysicBodyManager.bodies)
			.filter(x => !x.interactor.isLocked() 
				&& x.interactor.isSelected(lower, upper));
	}

	static toState(): PhysicBodyState {
		const state: PhysicBodyState = {};
		for (const key in PhysicBodyManager.bodies) {
			const body = PhysicBodyManager.bodies[key];
			state[key] = {
				type: body.getType(),
				props: body.serialize(),
				dependencies: PhysicBodyManager.getDependency(key) ?? {},
				renderer: body.renderer.serialize(),
			};
		}
		return state;
	}

	static getAllBodyIds(): string[] {
		return Object.keys(PhysicBodyManager.bodies);
	}

	// ============================== Loaders ==============================

	static loadFromState(state: PhysicBodyState): void {
		PhysicBodyManager.clear();
		for (const key in state) {
			PhysicBodyManager.loadBodyFromConfig(state, key);
			PhysicBodyManager.setDependency(key, state[key].dependencies || {});
		}
	}

	private static loadBodyFromConfig(
		state: PhysicBodyState,
		id: string
	): PhysicBody {
		const body = PhysicBodyManager.getById(id);
		if (body) return body;

		const config = state[id];
		if (!config) throw new Error("Unknown body key");

		const body_load_mapper = {
			[PhysicBodyType.POINT_MASS]: PhysicBodyManager.loadPointmassConfig,
			[PhysicBodyType.RIGID_CONSTRAINT]: PhysicBodyManager.loadRigidConstraintConfig,
			[PhysicBodyType.CIRCULAR_KINEMATIC]: PhysicBodyManager.loadCircularKinematicConfig,
		};

		const loader = body_load_mapper[config.type];
		if (loader) return loader(state, id, config);

		throw new Error("Unknown body type");
	}

	// TODO: separate this 
	private static loadPointmassConfig(
		_state: PhysicBodyState,
		id: string,
		config: PhysicBodyConfig
	): PointMass {
		const body = PhysicBodyManager.getById(id);
		if (body) return body as PointMass;

		const pointmass = new PointMass(config.props);
		pointmass.renderer = new PointMassRenderer(pointmass, config.renderer);
		PhysicBodyManager.addBody(pointmass, id);
		return pointmass;
	}
	
	private static loadRigidConstraintConfig(
		state: PhysicBodyState,
		id: string,
		config: PhysicBodyConfig
	): RigidConstraint {
		const body = PhysicBodyManager.getById(id);
		if (body) return body as RigidConstraint;

		const {
			pointmass1: pm1_id,
			pointmass2: pm2_id
		} = config.dependencies as {
			pointmass1: string,
			pointmass2: string
		};

		// TODO: better error handling message
		if (!pm1_id || !state[pm1_id]) throw new Error("Pointmass1 not found");
		if (!pm2_id || !state[pm2_id]) throw new Error("Pointmass2 not found");
		const pm1 = PhysicBodyManager.loadBodyFromConfig(state, pm1_id) as PointMass;
		const pm2 = PhysicBodyManager.loadBodyFromConfig(state, pm2_id) as PointMass;

		const rigid_constraint = new RigidConstraint(pm1, pm2, config.props);
		rigid_constraint.renderer = new RigidConstraintRenderer(rigid_constraint, config.renderer);
		PhysicBodyManager.addBody(rigid_constraint, id);
		return rigid_constraint;
	}

	private static loadCircularKinematicConfig(
		state: PhysicBodyState,
		id: string,
		config: PhysicBodyConfig
	): CircularKinematic {
		const body = PhysicBodyManager.getById(id);
		if (body) return body as CircularKinematic;

		const {
			center_pointmass: pm1_id,
			moving_pointmass: pm2_id
		} = config.dependencies as {
			center_pointmass: string,
			moving_pointmass: string
		};

		// TODO: better error handling message
		if (!pm1_id || !state[pm1_id]) throw new Error("Center pointmass not found");
		if (!pm2_id || !state[pm2_id]) throw new Error("Moving pointmass not found");
		const pm1 = PhysicBodyManager.loadBodyFromConfig(state, pm1_id) as PointMass;
		const pm2 = PhysicBodyManager.loadBodyFromConfig(state, pm2_id) as PointMass;

		const circular_kinematic = new CircularKinematic(pm1, pm2, config.props);
		circular_kinematic.renderer = new CircularKinematicRenderer(circular_kinematic, config.renderer);
		PhysicBodyManager.addBody(circular_kinematic, id);
		return circular_kinematic;
	}

	static clear(): void {
		PhysicBodyManager.bodies = {};
		PhysicBodyManager.dependency_table.clear();
		PhysicBodyManager.seed = 0;
	}

	// ============================== Body dependency ==============================

	private static setDependency(child_id: string, parent: Record<string, string>): void {
		PhysicBodyManager.dependency_table.set(child_id, parent);
	}

	private static getDependency(child_id: string): Record<string, string> | null {
		return PhysicBodyManager.dependency_table.get(child_id) || null;
	}

	private static hasDependency(child_id: string): boolean {
		return PhysicBodyManager.dependency_table.has(child_id);
	}

	private static getDependentBodies(parent_id: string): string[] {
		return Array.from(PhysicBodyManager.dependency_table.entries())
			.filter(([_, deps]) => Object.values(deps).includes(parent_id))
			.map(([child_id]) => child_id);
	}

	// ============================== Body creation ==============================

	static addBody(body: PhysicBody, id: string = ""): string {
		id = id || body.getType().toString() + PhysicBodyManager.seed;
		body.setId(id);
		PhysicBodyManager.bodies[id] = body;
		PhysicBodyManager.seed++;
		if (!PhysicBodyManager.hasDependency(id)) {
			PhysicBodyManager.setDependency(id, {});
		}
		PhysicBodyManager.on_tree_change(PhysicBodyManager.getAllBodyIds());
		return id;
	}

	static createPointMass(position: Vec2): string {
		const pointmass = new PointMass({ position });
		const body_name = PhysicBodyManager.addBody(pointmass);
		PhysicBodyManager.setDependency(body_name, {});
		return body_name;
	}

	static createRigidConstraint(
		pointmass1: PointMass, 
		pointmass2: PointMass
	): string {
		const rigid_constraint = new RigidConstraint(pointmass1, pointmass2);
		const body_name = PhysicBodyManager.addBody(rigid_constraint);
		PhysicBodyManager.setDependency(body_name, { 
			pointmass1: pointmass1.getId()!, 
			pointmass2: pointmass2.getId()! 
		});
		return body_name;
	}

    static createCircularKinematic(center_pointmass: PointMass, anchor_pointmass: PointMass) {
		const circular_kinematic = new CircularKinematic(center_pointmass, anchor_pointmass);
		const body_name = PhysicBodyManager.addBody(circular_kinematic);
		PhysicBodyManager.setDependency(body_name, { 
			center_pointmass: center_pointmass.getId()!, 
			moving_pointmass: anchor_pointmass.getId()! 
		});
		return body_name;
    }

	// ============================== Body update ==============================

	static updateConnectedConstraints(pointmass: PointMass): void {
		const pm_name = pointmass.getId();
		if (!pm_name) throw new Error("Pointmass has no id");
		
		PhysicBodyManager.getDependentBodies(pm_name)
			.map(child => PhysicBodyManager.getById(child))
			.filter((child): child is RigidConstraint => 
				child !== null && child.getType() === PhysicBodyType.RIGID_CONSTRAINT)
			.forEach(rigid => rigid.calculateRestDistance());
	}
}
