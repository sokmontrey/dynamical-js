A 2D JavaScript physic engine

NOTE! : the system doesn't conserve energy. Total energy declined overtime.

# How does this work?

This is a point-mass based 2d engine. This mean that any object can be formed by points that are hold together by Constraints. 

## PointMass

Each point contain its current position, old position (position from last timestep), acceleration, mass, and a few more properties. The `updatePosition` method uses Verlet integration in order to update the point position using only the previous position, current position, and acceleration. Verlet integration is easy to implement and it takes care of all the dynamic automatically. 

## Constraint

### RigidConstraint
Rigid rod connect points together with their initial distance from each other.
### SpringConstraint
Connect points together with springs. SpringConstraint is similar to RigidConstraint except it has the `spring_constant` which tell how stiff the spring is. `spring_constant` can be from 0 to 1, 1 is the stiffest value and 0 is the most flexible spring.
### ContainerConstraint
This Constraint can be used to contain all the point inside the canvas. ContainerConstraint is like a room containing **specified** objects, preventing them from leaving the area.

Live Demo: [Dynamical JS](https://dynamical.netlify.app/)
