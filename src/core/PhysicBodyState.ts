import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import { PhysicBodyProps } from "../core-physic/PhysicBody.ts";

export interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: Record<string, string>;
    props: PhysicBodyProps;
    renderer?: { // TODO: deal with this later
        [key: string]: {
            [key: string]: any
        }
    };
}

export default interface PhysicBodyState {
    [key: string]: PhysicBodyConfig;
}