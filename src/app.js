import Renderer from './renderer.js';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#232323');

class Point{
    constructor(pos_vector){
        this.current_position = pos_vector;
        this.old_position = pos_vector;
        this.old_velocity = math.zeros(2);
        this.acceleration = math.zeros(2);
        this.velocity = math.zeros(2);

        this.mass = 1;
    }
    updatePosition(delta_time){
        this.velocity = math.subtract(this.current_position, this.old_position);
        this.old_position = this.current_position;

        this.current_position = math.add(
            math.add(this.current_position, this.velocity),
            math.multiply(this.acceleration, delta_time * delta_time * 0.5)
        );

        this.acceleration._data[0] = 0;
        this.acceleration._data[1] = 0;
    }

    applyForce(force_vector){
        this.accelerate(math.divide(force_vector, this.mass));
    }

    accelerate(acc){
        this.acceleration = math.add(this.acceleration, acc);
    }

    get position (){ return this.current_position; }
    set position (new_position) {
        this.current_position = new_position;
    }
}
const p1 = new Point(math.add(renderer.CENTER, math.matrix([100,0])));

function applyGravity(){
    p1.applyForce(math.multiply(p1.mass * 20, math.matrix([0,1])));
}
function updatePosition(delta_time){
    p1.updatePosition(delta_time * 0.01);
}
function applyConstraint(){
    const position = renderer.CENTER;
    const radius = 200;

    const to_point = math.subtract(p1.position, position);
    const dist = math.sqrt(
        Math.pow(to_point._data[0],2) + Math.pow(to_point._data[1], 2)
    );
    if(dist > radius - 20){
        const n = math.divide(to_point, dist);
        const v = math.subtract(p1.position, p1.old_position);
        const contact_point = math.add(position, math.multiply(n, (dist-1)));

        p1.old_position = math.add(
            math.subtract(
                math.multiply(
                    1.8*(n._data[0]*v._data[0]+n._data[1]*v._data[1])
                    , n
                ), v
            ), contact_point
        );
        p1.position = contact_point;

    }
}

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    applyGravity();
    applyConstraint();
    updatePosition(delta_time);

    c.fillStyle='white';
    renderer.point(renderer.CENTER, 200)
    c.fillStyle='black';
    renderer.point(p1.position, 20);
});