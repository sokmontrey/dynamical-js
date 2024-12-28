import Body, { BodyType } from "../../core/Body";
import Vec2 from "../../utils/Vector";
import PointMass from "../point-mass/Body";
import CircularKinematic_Renderer, { RendererProps } from "./Renderer";

interface Props {
    angular_velocity: number;
    is_running: boolean;
}

export default class CircularKinematic extends Body<CircularKinematic, Props> {
    protected readonly moveable = false;
    protected readonly rank = 1;
    protected readonly type = BodyType.CIRCULAR_KINEMATIC;

    private radius: number = 10;
    private angle: number = 0;

    private center_pointmass: PointMass;
    private anchor_pointmass: PointMass;

    constructor({
        center_pointmass,
        anchor_pointmass,
        props,
        renderer,
    }: {
        center_pointmass: PointMass,
        anchor_pointmass: PointMass,
        props: Props,
        renderer: RendererProps,
    }) {
        super();
        this.center_pointmass = center_pointmass;
        this.anchor_pointmass = anchor_pointmass;
        this.props = props;
        this.renderer = new CircularKinematic_Renderer(renderer);

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
}