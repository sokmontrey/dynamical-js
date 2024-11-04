import Vec2 from "../utils/math/Vector.ts";

export interface PointMassParams {
	position?: Vec2,
	velocity?: Vec2,
	constant_acceleration?: Vec2,
	initial_force?: Vec2,
	mass?: number,
	is_static?: boolean,
};

