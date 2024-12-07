import { Actor, CollisionType, Vector } from 'excalibur';
import { Resources } from './resources';

export class Path extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Path',
      pos,
      width: 16,
      height: 16,
      collisionType: CollisionType.PreventCollision,
    });
  }

  override onInitialize() {
    const img =
      Math.random() < 0.1 ? Resources.PathDetail : Resources.PathPlain;

    this.graphics.add(img.toSprite());
  }
}
