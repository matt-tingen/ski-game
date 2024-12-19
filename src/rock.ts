import { Actor, CollisionType, Vector } from 'excalibur';
import { Resources } from './resources';
import { sprites } from './sprites';

export class Rock extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Rock',
      pos,
      width: 10,
      height: 10,
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    this.graphics.add(Resources.Rock.toSprite());
  }
}
