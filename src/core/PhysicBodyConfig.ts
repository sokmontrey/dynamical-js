import {PhysicBodyType} from "../core-physic/PhysicBody.ts";
import PhysicBodyProps from "./PhysicBodyProps.ts";
import RendererParams from "../renderer/RendererParams.ts";

export default interface PhysicBodyConfig {
    type: PhysicBodyType;
    dependencies?: {[key: string]: string};
    props: PhysicBodyProps;
    renderer?: RendererParams;
}