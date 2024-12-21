import Vec2 from "../utils/Vector";
import PhysicBody, {PhysicBodyType} from "./PhysicBody";
import PointMass from "./PointMass";
import RigidConstraint from "./RigidConstraint";
import PointMassRenderer from "../body-renderer/PointMassRenderer.ts";
import RigidConstraintRenderer from "../body-renderer/RigidConstraintRenderer.ts";
import PhysicBodyState, { PhysicBodyConfig } from "../core/PhysicBodyState.ts";
import DependencyManager from "../core/DependencyManager.ts";

export default class PhysicBodyManager {
	private static bodies: Record<string, PhysicBody> = {};
	private static seed: number = 0;
	private static initialized: boolean = false;

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

	static toState(dependency_manager: DependencyManager): PhysicBodyState {
		const state: PhysicBodyState = {};
		for (const key in PhysicBodyManager.bodies) {
			const body = PhysicBodyManager.bodies[key];
			state[key] = {
				type: body.getType(),
				props: body.serialize(),
				dependencies: dependency_manager.getDependency(key) ?? {},
					renderer: body.renderer.serialize(),
			};
		}
		return state;
	}

	private static loadFromState(state: PhysicBodyState): void {
		PhysicBodyManager.clear();
		for (const key in state) {
			PhysicBodyManager.loadBodyFromConfig(state, key);
		}
	}

	private static loadBodyFromConfig(
		state: PhysicBodyState,
		key: string
	): PhysicBody {
		const body = PhysicBodyManager.getByName(key);
		if (body) return body;

		const body_load_mapper = {
			[PhysicBodyType.POINT_MASS]: PhysicBodyManager.loadPointmassConfig,
			[PhysicBodyType.RIGID_CONSTRAINT]: PhysicBodyManager.loadRigidConstraintConfig,
		}

		const config = state[key];
		if (!config) throw new Error("Unknown body key");
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
		PhysicBodyManager.seed = 0;
	}
}
