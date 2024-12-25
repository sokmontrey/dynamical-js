import PhysicBody, { PhysicBodyType } from '../../core-physic/PhysicBody';
import PointMassPanel from '../property-panel/PointMassPanel';
import RigidConstraintPanel from '../property-panel/RigidConstraintPanel';

export interface PropertyPanelProps {
    body: PhysicBody | null;
}

export default function PropertyPanel({ 
    body,
}: PropertyPanelProps) {
    if (!body) return <></>;

    const body_panel_map: Record<PhysicBodyType, React.FC<any>> = {
        [PhysicBodyType.POINT_MASS]: PointMassPanel,
        [PhysicBodyType.RIGID_CONSTRAINT]: RigidConstraintPanel,
    };

    const BodyPanel = body_panel_map[body.getType()];

    return <div>
        <p>Id: {body.getId()} Type: {body.getType()}</p>
        <BodyPanel body={body} />
    </div>;
}
