import { sample } from 'es-toolkit';
import { Actor, CollisionType, Color, Particle, vec, Vector } from 'excalibur';
import { Resources } from './resources';
import { sprites } from './sprites';

export class Snowman extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Snowman',
      pos,
      width: 10,
      height: 10,
      offset: vec(0, -4),
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    this.graphics.add(sprites.snowman);
  }

  splat(velocity: Vector) {
    const particle = new Particle({
      beginColor: Color.White,
      endColor: Color.White,
      startSize: 10,
      endSize: 35,
      fade: true,
      life: 1500,
      vel: velocity.scale(0.1),
    });

    sample(Resources.FootstepSnow).play();
    this.addChild(particle);
    this.collider.clear();
    this.graphics.hide();
  }
}
