import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import Style from "../style/Style.ts";

export interface PhysicBodyProps { }

export interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: {
        [key: string]: string
    };
    props: PhysicBodyProps;
    renderer?: {
        [key: string]: {
            [key: string]: any
        }
    };
}

export default interface PhysicBodyState {
    [key: string]: PhysicBodyConfig;
}