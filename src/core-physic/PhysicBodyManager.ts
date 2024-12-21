import Vec2 from "../utils/Vector";
import PhysicBody, {PhysicBodyType} from "./PhysicBody";
import PointMass  from "./PointMass";
import RigidConstraint  from "./RigidConstraint";
import PointMassRenderer from "../body-renderer/PointMassRenderer.ts";
import RigidConstraintRenderer from "../body-renderer/RigidConstraintRenderer.ts";
import PhysicBodyState, { PhysicBodyConfig } from "../core/PhysicBodyState.ts";
import DependencyManager from "../core/DependencyManager.ts";

export default class PhysicBodyManager {
	private bodies: Record<string, PhysicBody> = {};
	private seed: number = 0;

	constructor() {
		this.clear();
	}

	addBody(body: PhysicBody, name: string = ""): string {
		name = name || "__body" + this.seed;
		this.bodies[name] = body;
		this.seed++;
		return name;
	}

	getName(body: PhysicBody) {
		return Object.keys(this.bodies).find(key => this.bodies[key] === body);
	}

	removeBody(body: PhysicBody) {
		const key = Object.keys(this.bodies).find(key => this.bodies[key] === body);
		if (key) delete this.bodies[key];
		// TODO: cascade pointmass delete to also delete constraints
		// TRY: PhysicBody.isUsingBody(body) to check if body is used by other bodies
		return this;
	}

	getAllBodies() {
		return Object.values(this.bodies);
	}

	getByName(name: string): PhysicBody | null {
		return this.bodies[name] || null;
	}

	getHoveredBodies(pos: Vec2) {
		return Object
			.values(this.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isHovered(pos));
	}

	getSelectedBodies(lower: Vec2, upper: Vec2) {
		return Object
			.values(this.bodies)
			.filter(x => !x.interactor.isLocked() && x.interactor.isSelected(lower, upper));
	}

	toState(dependency_manager: DependencyManager): PhysicBodyState {
		const state: PhysicBodyState = {};
		for (const key in this.bodies) {
			const body = this.bodies[key];
			state[key] = {
				type: body.getType(),
				props: body.serialize(),
				dependencies: dependency_manager.getDependency(key) ?? {},
				renderer: body.renderer.serialize(),
			};
		}
		return state;
	}

	loadFromState(state: PhysicBodyState): void {
		this.clear();
		for (const key in state) {
			this.loadBodyFromConfig(state, key);
		}
	}

	/**
	 * Recursively process the config of a body and its dependencies.
	 * Automatically add the body to the manager.
	 */
	private loadBodyFromConfig(
		state: PhysicBodyState,
		key: string
	): PhysicBody {
		const body = this.getByName(key);
		if (body) return body;

		const body_load_mapper = {
			[PhysicBodyType.POINT_MASS]: this.loadPointmassConfig.bind(this),
			[PhysicBodyType.RIGID_CONSTRAINT]: this.loadRigidConstraintConfig.bind(this),
		}

		const config = state[key];
		if (!config) throw new Error("Unknown body key");
		const loader = body_load_mapper[config.type];
		if (loader) return loader(state, key, config);

		throw new Error("Unknown body type");
	}

	private loadPointmassConfig(
		_state: PhysicBodyState,
		key: string,
		config: PhysicBodyConfig
	): PointMass {
		const body = this.getByName(key);
		if (body) return body as PointMass;

		const pointmass = new PointMass(config.props);
			pointmass.renderer = new PointMassRenderer(pointmass, config.renderer);
			this.addBody(pointmass, key);
			return pointmass;
	}
	
	private loadRigidConstraintConfig(
		state: PhysicBodyState,
		key: string,
		config: PhysicBodyConfig
	): RigidConstraint {
		const body = this.getByName(key);
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

		const pm1 = this.loadBodyFromConfig(state, pm1_key) as PointMass;
		const pm2 = this.loadBodyFromConfig(state, pm2_key) as PointMass;
		const rigid_constraint = new RigidConstraint(pm1, pm2, config.props);
		rigid_constraint.renderer = new RigidConstraintRenderer(rigid_constraint, config.renderer);
		this.addBody(rigid_constraint, key);
		return rigid_constraint;
	}

	clear(): void {
		this.bodies = {};
		this.seed = 0;
	}
}
