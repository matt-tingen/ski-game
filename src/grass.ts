import { Actor, CollisionType, vec, Vector } from 'excalibur';
import { sprites } from './sprites';

export class Grass extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Grass',
      pos,
      width: 10,
      height: 10,
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    this.graphics.add(sprites.grass);
  }

  override onCollisionStart(): void {
    this.actions.moveBy({
      offset: vec(1, 0),
      duration: 50,
    });
    this.actions.moveBy({
      offset: vec(-2, 0),
      duration: 100,
    });
    this.actions.moveBy({
      offset: vec(1, 0),
      duration: 50,
    });
  }
}
