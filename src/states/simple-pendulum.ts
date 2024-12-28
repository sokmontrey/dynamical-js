import { BodyType } from "../core/Body.ts";
import BodyState from "../core/BodyState.ts";
import Vec2 from "../utils/Vector.ts";

const simple_pendulum_state: BodyState = {
    "point1": {
        type: BodyType.POINT_MASS,
        props: { is_static: true, },
        renderer: {
            static_position: { radius: 5, fill_color: "red" },
        }
    },
    "point2": {
        type: BodyType.POINT_MASS,
        props: { position: Vec2.right(100), }
    },
    "rigid1": {
        type: BodyType.RIGID_CONSTRAINT,
        dependencies: { pointmass1: "point1", pointmass2: "point2", },
        props: { is_broken: false, }
    },
};

export default simple_pendulum_state;