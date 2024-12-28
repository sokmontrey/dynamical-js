const simple_pendulum_state_new: any = {
    point1: {
        type: "body(pointmass)",
        props: {
            position: "vec2(0,0)",
            is_static: true,
        },
        renderer: {
            type: "renderer(pointmass)",
            props: "ref(renderer1)"
        }
    },
    point2: {
        type: "body(pointmass)",
        props: {
            position: "vec2(100,0)",
        },
        renderer: {
            type: "renderer(pointmass)",
            props: "ref(renderer1)"
        }
    },
    rigid1: {
        type: "body(rigidconstraint)",
        pointmass1: "ref(point1)",
        pointmass2: "ref(point2)",
        props: { 
            is_broken: false, 
        },
        renderer: { 
            type: "renderer(rigidconstraint)",
            props: "ref(renderer1)"
        }
    },
    renderer1: {
        position: { 
            radius: 5, 
            fill_color: "blue" 
        },
        static_position: { 
            radius: 5, 
            fill_color: "red" 
        },
        constraint_line: {
            is_enable: true,
        }
    },
};

export default simple_pendulum_state_new;