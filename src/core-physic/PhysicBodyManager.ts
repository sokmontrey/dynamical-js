import Vec2 from "../utils/Vector";
import PhysicBody, {PhysicBodyType} from "./PhysicBody";
import PointMass, {PointMassProps} from "./PointMass";
import RigidConstraint, {RigidConstraintProps} from "./RigidConstraint";
import PointMassConfig from "../config/PointMassConfig.ts";
import RigidConstraintConfig from "../config/RigidConstraintConfig.ts";
import PointMassRenderer from "../renderer/PointMassRenderer.ts";
import RigidConstraintRenderer from "../renderer/RigidConstraintRenderer.ts";
import PhysicBodyState from "../core/PhysicBodyState.ts";
import PhysicBodyConfig from "../core/PhysicBodyConfig.ts";
import DependencyManager from "../core/DependencyManager.ts";

export default class PhysicBodyManager {
	private bodies: { [key: string]: PhysicBody };
	private seed: number;

	constructor() {
		this.bodies = {};
		this.seed = 0;
	}

	addBody(body: PhysicBody, name: string = ""): string {
		name = name || "__body" + this.seed++;
		this.bodies[name] = body;
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

	getByKey(key: string): PhysicBody | null {
		return this.bodies[key] || null;
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
				props: body.getProps(),
				dependencies: dependency_manager.getDependency(key) ?? {},
				renderer: body.renderer.getProps(),
			};
		}
		return state;
	}

	static fromState(state: PhysicBodyState): PhysicBodyManager {
		const manager = new PhysicBodyManager();
		for (const key in state) {
			PhysicBodyManager.configToBody(state, key, manager);
		}
		return manager;
	}

	/**
	 * Recursively process the config of a body and its dependencies.
	 * Automatically add the body to the manager.
	 */
	static configToBody(
		state: PhysicBodyState,
		key: string,
		body_manager: PhysicBodyManager
	): PhysicBody {
		const body = body_manager.getByKey(key);
		if (body) return body;

		const config = state[key];
		switch (config.type) {
			case PhysicBodyType.POINT_MASS:
				return PhysicBodyManager.loadPointmassConfig(
					state,
					key,
					config as PointMassConfig,
					body_manager);
			case PhysicBodyType.RIGID_CONSTRAINT:
				return PhysicBodyManager.loadRigidConstraintConfig(
					state,
					key,
					config as RigidConstraintConfig,
					body_manager);
			default: break;
		}

		throw new Error("Unknown body type");
	}

	static loadPointmassConfig(
		_state: PhysicBodyState,
		key: string,
		config: PointMassConfig,
		body_manager: PhysicBodyManager
	): PointMass {
		const body = body_manager.getByKey(key);
		if (body) return body as PointMass;

		const pointmass = new PointMass(config.props);
		pointmass.renderer = new PointMassRenderer(pointmass, config.renderer);
		body_manager.addBody(pointmass, key);
		return pointmass;
	}
	
	static loadRigidConstraintConfig(
		state: PhysicBodyState,
		key: string,
		config: PhysicBodyConfig,
		body_manager: PhysicBodyManager
	): RigidConstraint {
		const body = body_manager.getByKey(key);
		if (body) return body as RigidConstraint;

		const { pointmass1: pm1_key, pointmass2: pm2_key } = config.dependencies;
		if (!pm1_key || !state[pm1_key]) throw new Error("Pointmass1 not found");
		if (!pm2_key || !state[pm2_key]) throw new Error("Pointmass2 not found");

		const pm1 = PhysicBodyManager.configToBody(state, pm1_key, body_manager) as PointMass;
		const pm2 = PhysicBodyManager.configToBody(state, pm2_key, body_manager) as PointMass;
		const rigid_constraint = new RigidConstraint(pm1, pm2, config.props);
		rigid_constraint.renderer = new RigidConstraintRenderer(rigid_constraint, config.renderer);
		body_manager.addBody(rigid_constraint, key);
		return rigid_constraint;
	}
}
