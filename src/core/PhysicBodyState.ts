import PhysicBodyConfig from "./PhysicBodyConfig.ts";

export default interface PhysicBodyState {
    [key: string]: PhysicBodyConfig;
}