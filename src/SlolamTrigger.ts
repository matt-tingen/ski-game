import { Actor, CollisionType, vec } from 'excalibur';
import { SlolamSpeedup } from './SlolamSpeedup';

export class SlolamTrigger extends Actor {
  constructor(width: number) {
    super({
      name: 'SlolamTrigger',
      width,
      height: 2,
      anchor: vec(0.5, 0),
      collisionType: CollisionType.Fixed,
    });
  }

  onCollisionStart(): void {
    this.addChild(new SlolamSpeedup(vec(0, 16)));
  }
}
