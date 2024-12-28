import { PhysicBodyType } from "../core-physic/PhysicBody";
import PhysicBodyState from "../core/PhysicBodyState";
import Vec2 from "../utils/Vector";

const circular_kinematic_test_state: PhysicBodyState = {
    "point1": {
        type: PhysicBodyType.POINT_MASS,
        props: { is_static: true, },
        renderer: {
            static_position: { radius: 5, fill_color: "red" },
        }
    },
    "point2": {
        type: PhysicBodyType.POINT_MASS,
        props: { position: Vec2.right(50), }
    },
    "circular_kinematic": {
        type: PhysicBodyType.CIRCULAR_KINEMATIC,
        dependencies: { 
            center_pointmass: "point1",  // TODO: use Reference Object for automatic dependency loading 
            moving_pointmass: "point2", 
        },
        props: { radius: 100, angular_velocity: 0.1, }
    },
};

export default circular_kinematic_test_state;