import PointMass from "../core-physic/PointMass";
import RigidConstraint from "../core-physic/RigidConstraint";
import Point from "../quadtree/Point";
import Quadtree from "../quadtree/Quadtree";
import Vec2, { vec2 } from "../utils/math/Vector";

type Constraint = RigidConstraint;

export interface BodyHierarchy {
	pointmasses: PointMass[];
	constraints: Constraint[];
}

export default class SpatialQuery {
	private body_hierarchy: BodyHierarchy;

	private center: Vec2;
	private half_dim: Vec2;
	private pointmass_quadtree!: Quadtree<PointMass>;

	constructor(width: number, height: number) {
		this.body_hierarchy = {
			pointmasses: [],
			constraints: [],
		};
		this.center = Vec2.zero();
		this.half_dim = vec2(width, height).div(2);
		this.resetPointMassQuadtree();
	}

	addPointMass(pointmass: PointMass) {
		this.body_hierarchy.pointmasses.push(pointmass);
	}

	addConstraint(constraint: Constraint) {
		this.body_hierarchy.constraints.push(constraint);
	}

	/**
	* Must be called before any query
	**/
	update() {
		this.updatePointMassQuadtree();
	}

    updatePointMassQuadtree() {
		this.resetPointMassQuadtree();
		for(const pm of this.body_hierarchy.pointmasses) {
			const point = new Point<PointMass>(pm.getPosition(), pm);
			this.pointmass_quadtree.insert(point);
		}
    }

    private resetPointMassQuadtree() {
        this.pointmass_quadtree = new Quadtree<PointMass>(this.center, this.half_dim);
    }

    removePointMass(pointmass: PointMass) {
        throw new Error("Method not implemented.");
    }

	pickPointMass(pos: Vec2) {
        throw new Error("Method not implemented.");
	}

	selectPointMasses(lower: Vec2, upper: Vec2) {
        throw new Error("Method not implemented.");
	}
}
