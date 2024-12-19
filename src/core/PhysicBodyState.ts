import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import RendererProps from "../body-renderer/RendererProps.ts";

export interface PhysicBodyProps { }

export interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: {[key: string]: string};
    props: PhysicBodyProps;
    renderer?: RendererProps;
}

export default interface PhysicBodyState {
    [key: string]: PhysicBodyConfig;
}