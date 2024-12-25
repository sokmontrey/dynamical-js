import PhysicBody from '../../core-physic/PhysicBody';

export interface PropertyPanelProps {
    body: PhysicBody | null;
}

export default function PropertyPanel({ 
    body,
}: PropertyPanelProps) {
    if (!body) return <></>;
    return <div className='property-panel'>
        <p>Id: {body.getId()} Type: {body.getType()}</p>
        <body.panel body={body} key={body.getId()} />
    </div>;
}