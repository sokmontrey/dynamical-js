import Body, { BodyProps, BodyType } from "../../core/Body";
import Vec2 from "../../utils/Vector";
import PointMass from "../point-mass/Body";
import CircularKinematic_Interactor from "./Interactor";
import PanelProps from "./PanelProps";
import Renderer from "./Renderer";

interface Props extends BodyProps {
    angular_velocity?: number;
    is_running?: boolean;
}

export default class CircularKinematic extends Body {
    public panel_property: PanelProps;
    public renderer: Renderer;
    public interactor: CircularKinematic_Interactor;

    readonly rank = 1;
    readonly type = BodyType.CIRCULAR_KINEMATIC;

    private radius!: number;
    private angle!: number;
    private angular_velocity: number;
    private is_running: boolean;

    private center_pointmass: PointMass;
    private anchor_pointmass: PointMass;

    constructor(center_pointmass: PointMass, anchor_pointmass: PointMass, {
        angular_velocity = Math.PI / 6,
        is_running = true,
    }: Props = {}) {
        super();
        this.center_pointmass = center_pointmass;
        this.anchor_pointmass = anchor_pointmass;
        this.anchor_pointmass.enableStatic();

        this.calculateRadius();
        this.calculateAngle();
        this.angular_velocity = angular_velocity;

        this.is_running = is_running;

        this.panel_property = new PanelProps(this);
        this.renderer = new Renderer(this);
        this.interactor = new CircularKinematic_Interactor(this);
    }

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

    update(dt: number): void {
        this.anchor_pointmass.enableStatic(); // anchor point must be static
        if (!this.is_running) return;
        this.angle += this.angular_velocity * dt;
        this.angle = this.angle % (2 * Math.PI);

        const vec = Vec2.fromPolar(this.angle, this.radius);
        const center_pos = this.center_pointmass.getPosition();
        const new_pos = center_pos.add(vec);
        this.anchor_pointmass.setPosition(new_pos);

        this.triggerOnUpdate();
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
        return this.is_running;
    }

    getAngle(in_radian: boolean = true) {
        return in_radian ? this.angle : this.angle * 180 / Math.PI;
    }

    getAngularVelocity(in_radian: boolean = true) {
        return in_radian ? this.angular_velocity : this.angular_velocity * 180 / Math.PI;
    }

	//================================ Setters ================================

    setPosition(value: Vec2) {
        this.center_pointmass.moveTo(value);
    }

    setRunning(value: boolean) {
        this.is_running = value;
    }

    setAngularVelocity(value: number, in_radian: boolean = true) {
        this.angular_velocity = in_radian ? value : value * Math.PI / 180;
    }

    setAngle(value: number, in_radian: boolean = true) {
        this.angle = in_radian ? value : value * Math.PI / 180;
    }   

    setRadius(value: number) {
        this.radius = value;
    }

    //================================ Serialization ================================

    serialize(): Props {
        return {
            angular_velocity: this.getAngularVelocity(true),
            is_running: this.isRunning(),
        };
    }

    deserialize(props: Props): void {
        // TODO: deal with this
    }
}