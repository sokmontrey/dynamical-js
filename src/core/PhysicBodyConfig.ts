import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import PhysicBodyProps from "./PhysicBodyProps.ts";
import RendererProps from "../renderer/RendererProps.ts";

export default interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: {[key: string]: string};
    props: PhysicBodyProps;
    renderer?: RendererProps;
}