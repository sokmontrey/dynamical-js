import { PropBinder } from "../hooks/usePropBinder";

export default interface BodyPanelProps {
    getPropBinders(): PropBinder<any>[];
}