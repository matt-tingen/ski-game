import { Actor, CollisionType, vec, Vector } from 'excalibur';

export class SlolamSpeedup extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'SlolamSpeedup',
      pos,
      width: 200,
      height: 50,
      anchor: vec(0.5, 0),
      collisionType: CollisionType.Fixed,
    });
  }
}
