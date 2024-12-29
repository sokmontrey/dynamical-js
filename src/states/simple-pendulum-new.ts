const simple_pendulum_state_new: any = {
    point1: {
        type: "point_mass",
        props: {
            position: { x: 0, y: 0 },
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
        pointmass1: "point1",
        pointmass2: "point2",
        props: { 
            is_broken: false, 
        },
    },
};

export default simple_pendulum_state_new;