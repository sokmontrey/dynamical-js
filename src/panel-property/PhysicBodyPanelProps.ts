import { PropBinder } from "../hooks/usePropBinder";

export default interface PhysicBodyPanelProps {
    getPropBinders(): PropBinder<any>[];
}