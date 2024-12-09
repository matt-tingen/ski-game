import { Actor, CollisionType, vec, Vector } from 'excalibur';
import { SlolamSpeedup } from './SlolamSpeedup';

export class SlolamTrigger extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'SlolamTrigger',
      pos,
      width: 14,
      height: 2,
      // offset: vec
      collisionType: CollisionType.Fixed,
    });
  }

  onCollisionStart(): void {
    this.addChild(new SlolamSpeedup(vec(0, 16)));
  }
}
