const circular_kinematic_test_state: any = {
    point0: {
        type: "point_mass",
        props: {
            position: { x: -20, y: 0 },
            is_static: true,
        },
    },
    point1: {
        type: "point_mass",
        props: {
            position: { x: 20, y: 0 },
            is_static: true,
        },
    },
    point2: {
        type: "point_mass",
        props: {
            position: { x: 100, y: 0 },
        },
    },
    rigid1: {
        type: "rigid_constraint",
        dependencies: {
            pointmass1: "point1",
            pointmass2: "point2",
        },
        props: { 
            is_broken: false, 
        },
    },
    circular_motion: {
        type: "circular_kinematic",
        dependencies: {
            center_pointmass: "point0",
            anchor_pointmass: "point1",
        },
        props: {
            angular_velocity: Math.PI / 18,
        },
    },
};

export default circular_kinematic_test_state;