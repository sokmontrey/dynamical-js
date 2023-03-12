import Renderer from './renderer.js';
const Vector = Victor;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const renderer = new Renderer(canvas);
renderer.setBackground('#232323');


class Point{
    constructor({x,y}, radius=10){
        this.old_pos = new Vector(x,y);
        this.current_pos = new Vector(x,y);
        this.acc = new Vector(0,0);
        this.velocity = new Vector(0,0);

        this.mass = 1;
        this.radius = radius;
    }

    updatePosition(delta_time){
        this.velocity.x = this.current_pos.x - this.old_pos.x;
        this.velocity.y = this.current_pos.y - this.old_pos.y;

        this.old_pos.x = this.current_pos.x;
        this.old_pos.y = this.current_pos.y;

        const delta_time_squared = delta_time * delta_time;
        this.current_pos.add(this.velocity);
        this.current_pos.add(this.acc.multiply(new Vector(delta_time_squared, delta_time_squared)));

        this.acc.x = 0;
        this.acc.y = 0;
    }

    applyForce(force_vector){
        this.acc.x = force_vector.x / this.mass;
        this.acc.y = force_vector.y / this.mass;
    }

    getPosition(){
        return this.current_pos;
    }
    setPosition(new_position){
        this.current_pos.x = new_position.x;
        this.current_pos.y = new_position.y;
    }
}

const p = []; 
for(let i=0; i<2; i++) p.push(new Point(new Vector(250, 250 + i*30 - 130)));

function applyGravity(){
    for(let i=0; i<p.length; i++){
        p[i].applyForce(new Vector(0, 1 * p[i].mass * 9.8));
    }
}

function updatePosition(delta_time){
    for(let i=0; i<p.length; i++){
        p[i].updatePosition(delta_time);
    }
}

function applyConstraint(){
    const position = renderer.CENTER;
    const radius = 200;

    for(let i=0; i<p.length; i++){
        const to_point = p[i].getPosition().clone().subtract(position);
        const dist = to_point.length();

        if(dist > radius - 10){
            const n = new Vector(to_point.x/dist, to_point.y/dist);
            const v = p[i].old_pos.clone().subtract(p[i].getPosition());

            const contact_point = position.clone().add(n.clone().multiply(new Vector(dist-1, dist-1)));

            const dot = n.dot(v);
            p[i].old_pos = contact_point.clone().add(
                v.subtract(
                    n.multiply(
                        new Vector(
                            1*dot,
                            1*dot
                        )
                    )
                )
            );

            p[i].setPosition(contact_point);
        }
    }
}
function applyCollision(){
    for(let i=0; i<p.length; i++){
        for(let j=0; j<p.length; j++){
            const pa = p[i];
            const pb = p[j];

            const to_point = pa.getPosition().clone().subtract(pb.getPosition());
            const dist = to_point.length();

            if(dist < pa.radius + pb.radius){
                const na = new Vector(to_point.x/dist, to_point.y/dist);
                const nb = new Vector(-to_point.x/dist, -to_point.y/dist);

                const va = pa.old_pos.clone().subtract(pa.getPosition());
                const vb = pb.old_pos.clone().subtract(pb.getPosition());

                const contact_point_a = pa.getPosition().clone().add(na.clone().multiply(new Vector(dist/2-1, dist/2-1)));
                const contact_point_b = pb.getPosition().clone().add(nb.clone().multiply(new Vector(dist/2-1, dist/2-1)));

                const dot_a = na.dot(va);
                const dot_b = nb.dot(vb);

                pa.old_pos= contact_point_a.clone().add(
                    va.subtract(
                        na.multiply(
                            new Vector( 1*dot_b, 1*dot_b)
                        )
                    )
                );

                pb.old_pos= contact_point_b.clone().add(
                    vb.subtract(
                        nb.multiply(
                            new Vector( 1*dot_b, 1*dot_b)
                        )
                    )
                );

                pa.current_pos= contact_point_a;
                pb.current_pos= contact_point_b;
            }
        }
    }
}

renderer.update(({delta_time, context:c})=>{
    renderer.clear();

    applyGravity();
    updatePosition(delta_time * 0.01);
    for(let i=0; i<5; i++){
    applyCollision();
    applyConstraint();
    }

    c.fillStyle='white';
    renderer.point(renderer.CENTER, 200);
    c.fillStyle='black';
    for(let i=0; i<p.length; i++) renderer.point(p[i].getPosition(), 10);
});