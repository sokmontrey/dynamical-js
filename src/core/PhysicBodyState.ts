import { PhysicBodyRendererProps } from "../body-renderer/PhysicBodyRenderer.ts";
import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import { PhysicBodyProps } from "../core-physic/PhysicBody.ts";

export interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: Record<string, string>;
    props: PhysicBodyProps;
    renderer?: PhysicBodyRendererProps;
}

export default interface PhysicBodyState {
    [key: string]: PhysicBodyConfig;
}