import { Actor, CollisionType, Vector } from 'excalibur';
import { sprites } from './sprites';

export class Path extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Path',
      pos,
      width: 16,
      height: 16,
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    const img = Math.random() < 0.1 ? sprites.pathDetail : sprites.pathPlain;

    this.graphics.add(img);
  }
}
