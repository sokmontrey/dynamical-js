const strandbeest_state: any = {
    "point_mass5": {
        "id": "point_mass5",
        "type": "point_mass",
        "props": {
        "position": {
            "x": 39,
            "y": -69.5
        },
        "previous_position": {
            "x": 39,
            "y": -69.5
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": true
        },
    },
    "point_mass6": {
        "id": "point_mass6",
        "type": "point_mass",
        "props": {
        "position": {
            "x": 67.99115277716876,
            "y": -61.74673225982361
        },
        "previous_position": {
            "x": 67.99115277716876,
            "y": -61.74673225982361
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": true
        },
    },
    "point_mass7": {
        "id": "point_mass7",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -42,
            "y": -48.5
        },
        "previous_position": {
            "x": -42,
            "y": -48.5
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": true
        },
    },
    "point_mass8": {
        "id": "point_mass8",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -6.541318300264997,
            "y": -131.2021585466365
        },
        "previous_position": {
            "x": -6.540165416856075,
            "y": -131.2016642365338
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": false
        },
    },
    "point_mass9": {
        "id": "point_mass9",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -17.51959316305893,
            "y": 24.93960784544292
        },
        "previous_position": {
            "x": -17.521919066779375,
            "y": 24.940383122788806
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": false
        },
    },
    "point_mass10": {
        "id": "point_mass10",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -121.88980806372233,
            "y": -74.63957551374656
        },
        "previous_position": {
            "x": -121.88944366434504,
            "y": -74.64068919326361
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": false
        },
    },
    "point_mass11": {
        "id": "point_mass11",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -106.74889816031124,
            "y": 14.351932782353531
        },
        "previous_position": {
            "x": -106.75086956454298,
            "y": 14.351339094415335
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": false
        },
    },
    "point_mass12": {
        "id": "point_mass12",
        "type": "point_mass",
        "props": {
        "position": {
            "x": -57.812891814634526,
            "y": 131.98241433730846
        },
        "previous_position": {
            "x": -57.81666222371971,
            "y": 131.98251016259275
        },
        "constant_acceleration": {
            "x": 0,
            "y": 9.8
        },
        "net_force": {
            "x": 0,
            "y": 0
        },
        "mass": 1,
        "is_static": false
        },
    },
    "rigid_constraint13": {
        "id": "rigid_constraint13",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass12",
        "pointmass2": "point_mass9"
        }
    },
    "rigid_constraint14": {
        "id": "rigid_constraint14",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass9",
        "pointmass2": "point_mass11"
        }
    },
    "rigid_constraint15": {
        "id": "rigid_constraint15",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass11",
        "pointmass2": "point_mass10"
        }
    },
    "rigid_constraint16": {
        "id": "rigid_constraint16",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass10",
        "pointmass2": "point_mass7"
        }
    },
    "rigid_constraint17": {
        "id": "rigid_constraint17",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass10",
        "pointmass2": "point_mass8"
        }
    },
    "rigid_constraint18": {
        "id": "rigid_constraint18",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass8",
        "pointmass2": "point_mass7"
        }
    },
    "rigid_constraint19": {
        "id": "rigid_constraint19",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass11",
        "pointmass2": "point_mass12"
        }
    },
    "rigid_constraint20": {
        "id": "rigid_constraint20",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass9",
        "pointmass2": "point_mass7"
        }
    },
    "rigid_constraint21": {
        "id": "rigid_constraint21",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass9",
        "pointmass2": "point_mass6"
        }
    },
    "rigid_constraint22": {
        "id": "rigid_constraint22",
        "type": "rigid_constraint",
        "props": {
        "is_broken": false
        },
        "dependencies": {
        "pointmass1": "point_mass8",
        "pointmass2": "point_mass6"
        }
    },
    "circular_kinematic23": {
        "id": "circular_kinematic23",
        "type": "circular_kinematic",
        "props": {
        "angular_velocity": -0.5235987755982988,
        "is_running": true
        },
        "dependencies": {
        "center_pointmass": "point_mass5",
        "anchor_pointmass": "point_mass6"
        }
    }
};

export default strandbeest_state;