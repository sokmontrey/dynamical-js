import Vec2 from "../utils/Vector.ts";
import CircularKinematic from "../body/circular-kinematic/Body.ts";
import CircularKinematic_Renderer from "../body/circular-kinematic/Renderer.ts";
import BodyState, { BodyConfig } from "../core/BodyState.ts";
import Body, { BodyType } from "../core/Body.ts";
import PointMass from "../body/point-mass/Body.ts";
import PointMass_Renderer from "../body/point-mass/Renderer.ts";
import RigidConstraint from "../body/rigid-constraint/Body.ts";
import RigidConstraint_Renderer from "../body/rigid-constraint/Renderer.ts";

type TreeChangeCallback = (body_ids: string[]) => void;

export default class BodyManager {
	private static bodies: Record<string, Body> = {};
	private static seed: number = 0;
	private static initialized: boolean = false;
	private static dependency_table: Map<string, Record<string, string>> = new Map();
	private static on_tree_change: TreeChangeCallback = () => {};

	private constructor() {} // Prevent instantiation

	static init(state: BodyState): void {
		if (!BodyManager.initialized) {
			BodyManager.initialized = true;
		}
		BodyManager.loadFromState(state);
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

	static getId(body: Body): string | undefined {
		return Object.keys(BodyManager.bodies).find(key => BodyManager.bodies[key] === body);
	}

	static getById(id: string): Body | null {
		return BodyManager.bodies[id] || null;
	}

	static getAllBodies(): Body[] {
		return Object.values(BodyManager.bodies);
	}

	static getHoveredBodies(pos: Vec2): Body[] {
		return Object
			.values(BodyManager.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	static getSelectedBodies(lower: Vec2, upper: Vec2): Body[] {
		return Object
			.values(BodyManager.bodies)
			.filter(x => !x.interactor.isLocked() 
				&& x.interactor.isSelected(lower, upper));
	}

	static toState(): BodyState {
		const state: BodyState = {};
		for (const key in BodyManager.bodies) {
			const body = BodyManager.bodies[key];
			state[key] = {
				type: body.getType(),
				props: body.serialize(),
				dependencies: BodyManager.getDependency(key) ?? {},
				renderer: body.renderer.serialize(),
			};
		}
		return state;
	}

	static getAllBodyIds(): string[] {
		return Object.keys(BodyManager.bodies);
	}

	// ============================== Loaders ==============================

	static loadFromState(state: BodyState): void {
		BodyManager.clear();
		for (const key in state) {
			BodyManager.loadBodyFromConfig(state, key);
			BodyManager.setDependency(key, state[key].dependencies || {});
		}
	}

	private static loadBodyFromConfig(
		state: BodyState,
		id: string
	): Body {
		const body = BodyManager.getById(id);
		if (body) return body;

		const config = state[id];
		if (!config) throw new Error("Unknown body key");

		const body_load_mapper = {
			[BodyType.POINT_MASS]: BodyManager.loadPointmassConfig,
			[BodyType.RIGID_CONSTRAINT]: BodyManager.loadRigidConstraintConfig,
			[BodyType.CIRCULAR_KINEMATIC]: BodyManager.loadCircularKinematicConfig,
		};

		const loader = body_load_mapper[config.type];
		if (loader) return loader(state, id, config);

		throw new Error("Unknown body type");
	}

	// TODO: separate this 
	private static loadPointmassConfig(
		_state: BodyState,
		id: string,
		config: BodyConfig
	): PointMass {
		const body = BodyManager.getById(id);
		if (body) return body as PointMass;

		const pointmass = new PointMass(config.props);
		pointmass.renderer = new PointMass_Renderer(pointmass, config.renderer);
		BodyManager.addBody(pointmass, id);
		return pointmass;
	}
	
	private static loadRigidConstraintConfig(
		state: BodyState,
		id: string,
		config: BodyConfig
	): RigidConstraint {
		const body = BodyManager.getById(id);
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
		const pm1 = BodyManager.loadBodyFromConfig(state, pm1_id) as PointMass;
		const pm2 = BodyManager.loadBodyFromConfig(state, pm2_id) as PointMass;

		const rigid_constraint = new RigidConstraint(pm1, pm2, config.props);
		rigid_constraint.renderer = new RigidConstraint_Renderer(rigid_constraint, config.renderer);
		BodyManager.addBody(rigid_constraint, id);
		return rigid_constraint;
	}

	private static loadCircularKinematicConfig(
		state: BodyState,
		id: string,
		config: BodyConfig
	): CircularKinematic {
		const body = BodyManager.getById(id);
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
		const pm1 = BodyManager.loadBodyFromConfig(state, pm1_id) as PointMass;
		const pm2 = BodyManager.loadBodyFromConfig(state, pm2_id) as PointMass;

		const circular_kinematic = new CircularKinematic(pm1, pm2, config.props);
		circular_kinematic.renderer = new CircularKinematic_Renderer(circular_kinematic, config.renderer);
		BodyManager.addBody(circular_kinematic, id);
		return circular_kinematic;
	}

	static clear(): void {
		BodyManager.bodies = {};
		BodyManager.dependency_table.clear();
		BodyManager.seed = 0;
	}

	// ============================== Body dependency ==============================

	private static setDependency(child_id: string, parent: Record<string, string>): void {
		BodyManager.dependency_table.set(child_id, parent);
	}

	private static getDependency(child_id: string): Record<string, string> | null {
		return BodyManager.dependency_table.get(child_id) || null;
	}

	private static hasDependency(child_id: string): boolean {
		return BodyManager.dependency_table.has(child_id);
	}

	private static getDependentBodies(parent_id: string): string[] {
		return Array.from(BodyManager.dependency_table.entries())
			.filter(([_, deps]) => Object.values(deps).includes(parent_id))
			.map(([child_id]) => child_id);
	}

	// ============================== Body creation ==============================

	static addBody(body: Body, id: string = ""): string {
		id = id || body.getType().toString() + BodyManager.seed;
		body.setId(id);
		BodyManager.bodies[id] = body;
		BodyManager.seed++;
		if (!BodyManager.hasDependency(id)) {
			BodyManager.setDependency(id, {});
		}
		BodyManager.on_tree_change(BodyManager.getAllBodyIds());
		return id;
	}

	static createPointMass(position: Vec2): string {
		const pointmass = new PointMass({ position });
		const body_name = BodyManager.addBody(pointmass);
		BodyManager.setDependency(body_name, {});
		return body_name;
	}

	static createRigidConstraint(
		pointmass1: PointMass, 
		pointmass2: PointMass
	): string {
		const rigid_constraint = new RigidConstraint(pointmass1, pointmass2);
		const body_name = BodyManager.addBody(rigid_constraint);
		BodyManager.setDependency(body_name, { 
			pointmass1: pointmass1.getId()!, 
			pointmass2: pointmass2.getId()! 
		});
		return body_name;
	}

    static createCircularKinematic(center_pointmass: PointMass, anchor_pointmass: PointMass) {
		const circular_kinematic = new CircularKinematic(center_pointmass, anchor_pointmass);
		const body_name = BodyManager.addBody(circular_kinematic);
		BodyManager.setDependency(body_name, { 
			center_pointmass: center_pointmass.getId()!, 
			moving_pointmass: anchor_pointmass.getId()! 
		});
		return body_name;
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
