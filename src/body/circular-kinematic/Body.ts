import Body, { BodyType } from "@/core/Body";
import Vec2 from "@/utils/Vector";
import PointMass from "../point-mass/Body";
import CircularKinematic_Renderer, { CircularKinematic_RendererProps } from "./Renderer";
import CircularKinematic_Interactor from "./Interactor";

export interface CircularKinematic_Props {
    angular_velocity: number;
    is_running: boolean;
}

export default class CircularKinematic extends Body<CircularKinematic, CircularKinematic_Props> {
    protected readonly moveable = false;
    protected readonly rank = 2;
    protected readonly type = BodyType.CIRCULAR_KINEMATIC;

    private radius: number = 10;
    private angle: number = 0;

    private center_pointmass: PointMass;
    private anchor_pointmass: PointMass;

    protected props: CircularKinematic_Props;
    public renderer: CircularKinematic_Renderer;
    public interactor: CircularKinematic_Interactor;

    constructor({
        center_pointmass,
        anchor_pointmass,
        props = {},
        renderer = {},
    }: {
        center_pointmass: PointMass,
        anchor_pointmass: PointMass,
        props?: Partial<CircularKinematic_Props>,
        renderer?: CircularKinematic_RendererProps,
    }) {
        super();
        this.center_pointmass = center_pointmass;
        this.anchor_pointmass = anchor_pointmass;
        this.props = {
            angular_velocity: props?.angular_velocity || Math.PI / 3,
            is_running: props?.is_running || true,
        };
        this.renderer = new CircularKinematic_Renderer(renderer);
        this.interactor = new CircularKinematic_Interactor(this);

        this.calculateRadius();
        this.calculateAngle();
    }

    update(dt: number): void {
        this.anchor_pointmass.enableStatic(); // anchor point must be static
        if (!this.props.is_running) return;
        this.angle += this.props.angular_velocity * dt;
        this.angle = this.angle % (2 * Math.PI);

        const vec = Vec2.fromPolar(this.angle, this.radius);
        const center_pos = this.center_pointmass.getPosition();
        const new_pos = center_pos.add(vec);
        this.anchor_pointmass.setPosition(new_pos);

        this.triggerOnUpdate();
    }

    //================================ Helpers ================================

    calculateRadius() {
        return this.radius = this.center_pointmass
            .getPosition()
            .distance(this.anchor_pointmass.getPosition());
    }

    calculateAngle() {
        const anchor_pos = this.anchor_pointmass.getPosition();
        const center_pos = this.center_pointmass.getPosition();
        // vector from center to anchor
        const vec = anchor_pos.sub(center_pos);
        return this.angle = vec.angle();
    }

	//================================ Getters ================================

    getDependencies(): string[] {
        return [this.center_pointmass.getId()!, this.anchor_pointmass.getId()!];
    }

    getPointMasses() {
        return [this.center_pointmass, this.anchor_pointmass];
    }

    getRadius() {
        return this.radius;
    }

    getPosition() {
        return this.center_pointmass.getPosition();
    }

    isRunning(): boolean {
        return this.props.is_running;
    }

    getAngle(in_radian: boolean = true) {
        return in_radian ? this.angle : this.angle * 180 / Math.PI;
    }

    getAngularVelocity(in_radian: boolean = true) {
        return in_radian ? this.props.angular_velocity : this.props.angular_velocity * 180 / Math.PI;
    }

	//================================ Setters ================================

    setPosition(value: Vec2) {
        this.center_pointmass.moveTo(value);
    }

    setRunning(value: boolean) {
        this.props.is_running = value;
    }

    setAngularVelocity(value: number, in_radian: boolean = true) {
        this.props.angular_velocity = in_radian ? value : value * Math.PI / 180;
    }

    setAngle(value: number, in_radian: boolean = true) {
        this.angle = in_radian ? value : value * Math.PI / 180;
    }   

    setRadius(value: number) {
        this.radius = value;
    }

    //================================ Serialization ================================

    toJSON(): any {
        return {
            ...super.toJSON(),
            dependencies: {
                center_pointmass: this.center_pointmass.getId(),
                anchor_pointmass: this.anchor_pointmass.getId(),
            },
        };
    }
}