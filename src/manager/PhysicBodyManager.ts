import Vec2 from "../utils/Vector.ts";
import PhysicBody, {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import PointMass from "../core-physic/PointMass.ts";
import RigidConstraint from "../core-physic/RigidConstraint.ts";
import PointMassRenderer from "../body-renderer/PointMassRenderer.ts";
import RigidConstraintRenderer from "../body-renderer/RigidConstraintRenderer.ts";
import PhysicBodyState, { PhysicBodyConfig } from "../core/PhysicBodyState.ts";

export default class PhysicBodyManager {
	private static bodies: Record<string, PhysicBody> = {};
	private static seed: number = 0;
	private static initialized: boolean = false;
	private static dependency_table: Map<string, Record<string, string>> = new Map();

	private constructor() {} // Prevent instantiation

	static init(state: PhysicBodyState): void {
		if (!PhysicBodyManager.initialized) {
			PhysicBodyManager.initialized = true;
		}
		PhysicBodyManager.loadFromState(state);
	}

	static addBody(body: PhysicBody, name: string = ""): string {
		name = name || "__body" + PhysicBodyManager.seed;
		PhysicBodyManager.bodies[name] = body;
		PhysicBodyManager.seed++;
		
		if (!PhysicBodyManager.hasDependency(name)) {
			PhysicBodyManager.setDependency(name, {});
		}
		
		return name;
	}

	static getName(body: PhysicBody): string | undefined {
		return Object.keys(PhysicBodyManager.bodies).find(key => PhysicBodyManager.bodies[key] === body);
	}

	static removeBody(body: PhysicBody): void {
		const key = Object.keys(PhysicBodyManager.bodies).find(key => PhysicBodyManager.bodies[key] === body);
		if (key) delete PhysicBodyManager.bodies[key];
		// TODO: cascade pointmass delete to also delete constraints
		// TRY: PhysicBody.isUsingBody(body) to check if body is used by other bodies
	}

	static getAllBodies(): PhysicBody[] {
		return Object.values(PhysicBodyManager.bodies);
	}

	// TODO: rename name to id
	static getByName(name: string): PhysicBody | null {
		return PhysicBodyManager.bodies[name] || null;
	}

	static getHoveredBodies(pos: Vec2): PhysicBody[] {
		return Object
			.values(PhysicBodyManager.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	static getSelectedBodies(lower: Vec2, upper: Vec2): PhysicBody[] {
		return Object
			.values(PhysicBodyManager.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isSelected(lower, upper));
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

	static loadFromState(state: PhysicBodyState): void {
		PhysicBodyManager.clear();
		for (const key in state) {
			PhysicBodyManager.loadBodyFromConfig(state, key);
			// TODO: once createPointMass and createRigidConstraint are implemented,
			// this line will be moved there
			PhysicBodyManager.setDependency(key, state[key].dependencies || {});
		}
	}

	private static loadBodyFromConfig(
		state: PhysicBodyState,
		key: string
	): PhysicBody {
		const body = PhysicBodyManager.getByName(key);
		if (body) return body;

		const config = state[key];
		if (!config) throw new Error("Unknown body key");

		const body_load_mapper = {
			[PhysicBodyType.POINT_MASS]: PhysicBodyManager.loadPointmassConfig,
			[PhysicBodyType.RIGID_CONSTRAINT]: PhysicBodyManager.loadRigidConstraintConfig,
		};

		const loader = body_load_mapper[config.type];
		if (loader) return loader(state, key, config);

		throw new Error("Unknown body type");
	}

	private static loadPointmassConfig(
		_state: PhysicBodyState,
		key: string,
		config: PhysicBodyConfig
	): PointMass {
		const body = PhysicBodyManager.getByName(key);
		if (body) return body as PointMass;

		const pointmass = new PointMass(config.props);
		pointmass.renderer = new PointMassRenderer(pointmass, config.renderer);
		PhysicBodyManager.addBody(pointmass, key);
		return pointmass;
	}
	
	private static loadRigidConstraintConfig(
		state: PhysicBodyState,
		key: string,
		config: PhysicBodyConfig
	): RigidConstraint {
		const body = PhysicBodyManager.getByName(key);
		if (body) return body as RigidConstraint;

		const {
			pointmass1: pm1_key,
			pointmass2: pm2_key
		} = config.dependencies as {
			pointmass1: string,
			pointmass2: string
		};

		// TODO: better error handling message
		if (!pm1_key || !state[pm1_key]) throw new Error("Pointmass1 not found");
		if (!pm2_key || !state[pm2_key]) throw new Error("Pointmass2 not found");

		const pm1 = PhysicBodyManager.loadBodyFromConfig(state, pm1_key) as PointMass;
		const pm2 = PhysicBodyManager.loadBodyFromConfig(state, pm2_key) as PointMass;
		const rigid_constraint = new RigidConstraint(pm1, pm2, config.props);
		rigid_constraint.renderer = new RigidConstraintRenderer(rigid_constraint, config.renderer);
		PhysicBodyManager.addBody(rigid_constraint, key);
		return rigid_constraint;
	}

	static clear(): void {
		PhysicBodyManager.bodies = {};
		PhysicBodyManager.dependency_table.clear();
		PhysicBodyManager.seed = 0;
	}

	// ============================== Body dependency ==============================

	private static setDependency(child_name: string, parent: Record<string, string>): void {
		PhysicBodyManager.dependency_table.set(child_name, parent);
	}

	private static getDependency(child_name: string): Record<string, string> | null {
		return PhysicBodyManager.dependency_table.get(child_name) || null;
	}

	private static hasDependency(child_name: string): boolean {
		return PhysicBodyManager.dependency_table.has(child_name);
	}

	private static getDependentBodies(parent_name: string): string[] {
		return Array.from(PhysicBodyManager.dependency_table.entries())
			.filter(([_, parent]) => Object.values(parent).includes(parent_name))
			.map(([child]) => child);
	}

	// ============================== Body creation ==============================

	static addPointMass(position: Vec2, name: string = ""): string {
		const pointmass = new PointMass({ position });
		const body_name = PhysicBodyManager.addBody(pointmass, name);
		PhysicBodyManager.setDependency(body_name, {});
		return body_name;
	}

	static addRigidConstraint(pointmass1: PointMass, pointmass2: PointMass): string {
		// TODO: implement id in each body for better id accessing without searching
		const rigid_constraint = new RigidConstraint(pointmass1, pointmass2);
		const pm1_name = PhysicBodyManager.getName(pointmass1) || "";
		const pm2_name = PhysicBodyManager.getName(pointmass2) || "";
		
		// TODO: why not adding name while addPointMass has it?
		const body_name = PhysicBodyManager.addBody(rigid_constraint);
		PhysicBodyManager.setDependency(body_name, { 
			pointmass1: pm1_name, 
			pointmass2: pm2_name 
		});
		return body_name;
	}

	// ============================== Body update ==============================

	static updateConnectedConstraints(pointmass: PointMass): void {
		const name = PhysicBodyManager.getName(pointmass);
		if (!name) return;
		
		PhysicBodyManager.getDependentBodies(name)
			.map(child => PhysicBodyManager.getByName(child))
			.filter((child): child is RigidConstraint => 
				child !== null && child.type === PhysicBodyType.RIGID_CONSTRAINT)
			.forEach(rigid => {
				rigid.calculateRestDistance();
			});
	}
}
