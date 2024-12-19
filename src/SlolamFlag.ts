import { Actor, CollisionType, vec, Vector } from 'excalibur';
import { Resources } from './resources';
import { SlolamTrigger } from './SlolamTrigger';
import { sprites } from './sprites';

export class SlolamFlag extends Actor {
  private trigger!: SlolamTrigger;

  constructor(
    public direction: 'left' | 'right',
    pos: Vector,
  ) {
    super({
      name: 'SlolamFlag',
      pos,
      width: 4,
      height: 4,
      anchor: vec(0.5, 1),
      offset: vec(direction === 'right' ? -6 : 6, 0),
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    this.graphics.add(
      this.direction === 'right'
        ? Resources.FlagRed.toSprite()
        : Resources.FlagBlue.toSprite(),
    );
  }

  onCollisionStart(): void {
    const rads = 0.2;
    const t = 50;

    Resources.FlagHit.play();

    this.actions.rotateTo({
      angle: rads,
      duration: t,
    });
    this.actions.rotateTo({
      angle: -rads,
      duration: 2 * t,
    });
    this.actions.rotateTo({
      angle: rads,
      duration: 2 * t,
    });
    this.actions.rotateTo({
      angle: 0,
      duration: t,
    });
  }
}
