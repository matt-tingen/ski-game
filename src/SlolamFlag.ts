import {
  Actor,
  Collider,
  CollisionContact,
  CollisionType,
  Side,
  vec,
  Vector,
} from 'excalibur';
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
      height: 6,
      offset: vec(direction === 'left' ? -2 : 2, -5),
      collisionType: CollisionType.Fixed,
    });
  }

  override onInitialize() {
    this.graphics.add(
      this.direction === 'left' ? sprites.flagRedSmall : sprites.flagBlueSmall,
    );

    this.trigger = new SlolamTrigger(
      vec(this.direction === 'left' ? -6 : 6, 4),
    );
    this.addChild(this.trigger);
  }

  onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact,
  ): void {
    this.trigger.kill();
    const rads = 0.2;
    const t = 50;

    Resources.FlagHit.play();

    this.actions.rotateTo({
      angleRadians: rads,
      durationMs: t,
    });
    this.actions.rotateTo({
      angleRadians: -rads,
      durationMs: 2 * t,
    });
    this.actions.rotateTo({
      angleRadians: rads,
      durationMs: 2 * t,
    });
    this.actions.rotateTo({
      angleRadians: 0,
      durationMs: t,
    });
  }
}
