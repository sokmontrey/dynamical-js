import { PhysicBodyType } from "../core-physic/PhysicBody";
import PhysicBodyState from "../core/PhysicBodyState";
import Vec2 from "../utils/Vector";

const simple_pendulum_state: PhysicBodyState = {
    "point1": {
        type: PhysicBodyType.POINT_MASS,
        props: { is_static: true, },
        renderer: {
            static_position: { radius: 5, fill_color: "red" },
        }
    },
    "point2": {
        type: PhysicBodyType.POINT_MASS,
        props: { position: Vec2.right(100), }
    },
    "rigid1": {
        type: PhysicBodyType.RIGID_CONSTRAINT,
        dependencies: { pointmass1: "point1", pointmass2: "point2", },
        props: { is_broken: false, }
    },
};

export default simple_pendulum_state;