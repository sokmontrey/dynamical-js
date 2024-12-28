import { BodyProps, BodyType } from "./Body";
import { BodyRendererProps } from "./BodyRenderer";

export interface BodyConfig {
    type: BodyType;
    dependencies?: Record<string, string>;
    props: BodyProps;
    renderer?: BodyRendererProps;
}

export default interface BodyState {
    [key: string]: BodyConfig;
}