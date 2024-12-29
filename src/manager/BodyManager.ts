import Vec2, { vec2 } from "../utils/Vector.ts";
import CircularKinematic, { CircularKinematic_Props } from "../body/circular-kinematic/Body.ts";
import Body, { BodyType } from "../core/Body.ts";
import PointMass, { PointMass_Props } from "../body/point-mass/Body.ts";
import RigidConstraint, { RigidConstraint_Props } from "../body/rigid-constraint/Body.ts";
import { RendererProps } from "../body/point-mass/Renderer.ts";

type TreeChangeCallback = (body_ids: string[]) => void;

export default class BodyManager {
	private static bodies: Record<string, Body<any, any>> = {};
	private static seed: number = 0;
	private static initialized: boolean = false;
	private static dependency_table: Map<string, string[]> = new Map();
	private static state: Record<string, any> = {};
	private static on_tree_change: TreeChangeCallback = () => {};

	private constructor() {} // Prevent instantiation

	static init(state: string): void {
		if (!BodyManager.initialized) {
			BodyManager.initialized = true;
		}
		BodyManager.loadFromJSON(state);
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

	static toJSON(): any {
		return Object.fromEntries(
			Object.entries(BodyManager.bodies)
				.map(([id, body]) => [ id, body.toJSON() ])
		);
	}

	static getAllBodyIds(): string[] {
		return Object.keys(BodyManager.bodies);
	}

	// ============================== Loaders ==============================

	static loadFromJSON(state_json: string): void {
		// BodyManager.state = JSON.parse(state_json);
		// Object.entries(BodyManager.state).forEach(([id, body]) => {
		// 	if (BodyManager.bodies[id]) return;
		// 	const params = BodyManager.processTags(body);
		// 	const _body = BodyManager.createBody(params);
		// 	if (!_body) throw new Error("Invalid body");
		// 	BodyManager.addBody(_body, id);
		// });
	}

	static clear(): void {
		BodyManager.bodies = {};
		BodyManager.dependency_table.clear();
		BodyManager.seed = 0;
	}

	// ============================== Body dependency ==============================

	private static setDependency(child_id: string, parent: string[]): void {
		BodyManager.dependency_table.set(child_id, parent);
	}

	private static getDependency(child_id: string): string[] | null {
		return BodyManager.dependency_table.get(child_id) || null;
	}

	private static hasDependency(child_id: string): boolean {
		return BodyManager.dependency_table.has(child_id);
	}

	private static getDependentBodies(parent_id: string): string[] {
		return Array.from(BodyManager.dependency_table.entries())
			.filter(([_, deps]) => deps.includes(parent_id))
			.map(([child_id]) => child_id);
	}

	// ============================== Body creation ==============================

	static addBody(body: Body<any, any>, id: string = ""): string {
		id = id || body.getType().toString() + BodyManager.seed;
		body.setId(id);
		BodyManager.bodies[id] = body;
		BodyManager.seed++;
		BodyManager.setDependency(id, body.getDependencies());
		BodyManager.on_tree_change(BodyManager.getAllBodyIds());
		console.log(this.dependency_table)
		return id;
	}

	static createPointMass({ props, renderer }: {
		props?: Partial<PointMass_Props>,
		renderer?: RendererProps,
	}): PointMass {
		const body = new PointMass({
			props: {
				position: props?.position || vec2(0, 0),
				previous_position: props?.position || vec2(0, 0),
				constant_acceleration: props?.constant_acceleration || vec2(0, 9.8),
				net_force: props?.net_force || vec2(0, 0),
				mass: props?.mass || 1,
				is_static: props?.is_static || false,
			},
			renderer: {
				...renderer,
			},
		});
		BodyManager.addBody(body);
		return body;
	}

	static createRigidConstraint({ pointmass1, pointmass2, props, renderer }: {
		pointmass1: PointMass,
		pointmass2: PointMass,
		props?: Partial<RigidConstraint_Props>,
		renderer?: RendererProps,
	}): RigidConstraint {
		const body = new RigidConstraint({
			pointmass1,
			pointmass2,
			props: {
				is_broken: props?.is_broken || false,
			},
			renderer: {
				...renderer,
			},
		});
		BodyManager.addBody(body);
		return body;
	}

	static createCircularKinematic({ center_pointmass, anchor_pointmass, props, renderer }: {
		center_pointmass: PointMass,
		anchor_pointmass: PointMass,
		props?: Partial<CircularKinematic_Props>,
		renderer?: RendererProps,
	}): CircularKinematic {
		const body = new CircularKinematic({
			center_pointmass,
			anchor_pointmass,
			props: {
				angular_velocity: props?.angular_velocity || Math.PI / 3,
				is_running: props?.is_running || true,
			},
			renderer: {
				...renderer,
			},
		});
		BodyManager.addBody(body);
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
