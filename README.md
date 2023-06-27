A 2D JavaScript physic engine

NOTE! : 
- This is not an official Documentation. 
- The system doesn't conserve energy. Total energy declined overtime.

# How does this work?

This is a point-mass aggregated based 2D physic engine. Any objects can be made up of points connected together with "Distance" constraints.

## PointMass

A point mass is an object that contain many physical properties such as position, velocity, acceleration, mass, etc. Each frame of the simulation, the position of the point-mass will be updated using a certain numerical integration method to get a behaviour like how a ball would move in real life. Dynamical JS use Verlet's integration to update the position of all of its point mass. This integration method is unique as it calculate the velocity of the point using its previous and current position. This is great when it come to collision resolution and dynamic. Verlet's integration will take care of all the dynamic automatically as long as the point's previous and current position is manipulated in a conservative way. 

## Constraint
Constraints are mathematical equations that limit the movement of points. There are a few important type of constraint in Dynamical JS.

### Distance Constraint
This Constraint limit the movement of two point-masses. It makes sure that the two points stays in a certain distance away from one another. It also make sure that the points will not move away from the constraint distance apart. Distance Constraint can be rigid (like a solid stick) or spring by setting the `spring_constant` properties.

```js
0 < spring_constant <= 1
//1: very rigid
//0: very springy
```

## Composite
A composite is a object consisted of vertices connected together using distance constraint. 

## Control Flow
There are specific order for which physic operations (check constraint, update position, etc) should be perform. By not following this control flow, the simulation could break down very easily.

For each frame and each iteration:
1. Apply Forces
2. Check All the constraints
    a. Distance Constraint
    b. Container and\or Collider Constraint
3. Update point_mass postion
4. Render

Live Demo: [Dynamical JS](https://dynamical.netlify.app/)
