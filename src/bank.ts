import { Actor, CollisionType, Vector } from 'excalibur';
import { sprites } from './sprites';

export class Bank extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Bank',
      pos,
      width: 16,
      height: 16,
      collisionType: CollisionType.Passive,
    });
  }

  override onInitialize() {
    const img = Math.random() < 0.1 ? sprites.bankDetail : sprites.bankPlain;

    this.graphics.add(img);
  }
}
