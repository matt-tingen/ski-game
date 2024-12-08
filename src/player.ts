import { noop, sample } from 'es-toolkit';
import {
  Actor,
  Animation,
  AnimationStrategy,
  clamp,
  Collider,
  CollisionContact,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Keys,
  ParticleEmitter,
  Side,
  vec,
  Vector,
} from 'excalibur';
import { Button } from './Button';
import { Config } from './Config';
import { Resources } from './resources';
import { Rock } from './rock';
import { SlolamSpeedup } from './SlolamSpeedup';
import { Snowman } from './snowman';
import { sprites } from './sprites';

// Export the collision group, useful for referencing in other actors
export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export type SkierColor = 'Pink' | 'Green';

export class Player extends Actor {
  public controlsEnabled = true;
  public dead = false;

  private skierColor: SkierColor = 'Pink';

  private downhillSpeed = Config.playerInitialDownhillSpeed;
  private lateralSpeed = 0;
  private collisionCount = 0;

  private obstacleDisplacement = Vector.Zero.clone();

  private leftTurnButton!: Button;
  private rightTurnButton!: Button;
  private isTouch = window.matchMedia('(pointer: coarse)').matches;

  constructor(pos: Vector) {
    super({
      name: 'Player',
      pos,
      radius: 6,
      collisionGroup: PlayerCollisionGroup,
      collisionType: CollisionType.Passive,
    });
  }

  override onInitialize(engine: Engine) {
    this.graphics.add('up', sprites[`skier${this.skierColor}Up`]);
    this.graphics.add('down', sprites[`skier${this.skierColor}Down`]);

    this.addWakeEmitter(vec(-4, 0));
    this.addWakeEmitter(vec(4, 0));

    this.graphics.add(
      'push',
      new Animation({
        strategy: AnimationStrategy.Loop,
        frames: [
          {
            graphic: sprites[`skier${this.skierColor}Down`],
            duration: 400,
          },
          {
            graphic: sprites[`skier${this.skierColor}Up`],
            duration: 1000,
          },
        ],
      }),
    );
    this.graphics.use('push');

    this.addChild(
      (this.leftTurnButton = new Button(noop, {
        width: engine.halfDrawWidth,
        height: engine.drawHeight,
      })),
    );
    this.addChild(
      (this.rightTurnButton = new Button(noop, {
        width: engine.halfDrawWidth,
        x: engine.halfDrawWidth,
        height: engine.drawHeight,
      })),
    );
  }

  private addWakeEmitter(pos: Vector) {
    const emitter = new ParticleEmitter({
      pos,
      emitRate: 200,
      particle: {
        startSize: 2,
        endSize: 2,
        beginColor: new Color(195, 217, 232),
        fade: true,
        life: 4000,
      },
    });

    this.addChild(emitter);
  }

  override update(engine: Engine, elapsedMs: number): void {
    if (this.dead) {
      this.vel = Vector.Zero;
      this.graphics.use('down');

      return;
    }

    const delta = (value: number) => value * (elapsedMs / 1000);

    if (
      this.controlsEnabled &&
      (engine.input.keyboard.isHeld(Keys.A) ||
        engine.input.keyboard.isHeld(Keys.Left) ||
        (this.isTouch && this.leftTurnButton.isDown))
    ) {
      this.lateralSpeed += delta(Config.playerTurnSpeed);
    } else if (
      this.controlsEnabled &&
      (engine.input.keyboard.isHeld(Keys.D) ||
        engine.input.keyboard.isHeld(Keys.Right) ||
        (this.isTouch && this.rightTurnButton.isDown))
    ) {
      this.lateralSpeed -= delta(Config.playerTurnSpeed);
    } else {
      this.lateralSpeed +=
        Math.min(
          Math.abs(this.lateralSpeed),
          delta(Config.playerLateralFriction),
        ) * -Math.sign(this.lateralSpeed);
    }

    this.lateralSpeed = clamp(
      this.lateralSpeed,
      -Config.playerMaxTurn,
      Config.playerMaxTurn,
    );

    if (this.collisionCount) {
      for (; this.collisionCount > 0; this.collisionCount--) {
        this.downhillSpeed -= delta(
          Config.playerCollisionFriction * this.downhillSpeed,
        );
      }
    } else {
      this.downhillSpeed += delta(Config.playerDownhillAcceleration);
    }

    this.vel = Vector.Down.clone()
      .scale(this.downhillSpeed)
      .add(Vector.Left.clone().scale(this.lateralSpeed))
      .normalize()
      .scale(this.downhillSpeed);

    this.rotation = this.vel.toAngle() - Math.PI / 2;

    this.graphics.use(
      this.downhillSpeed < 100 && Math.abs(this.lateralSpeed) < 50
        ? 'push'
        : 'up',
    );
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    this.obstacleDisplacement = Vector.Zero.clone();
    this.collisionCount = 0;
  }

  override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact,
  ): void {
    const otherOwner = other.owner;

    if (otherOwner instanceof Rock) {
      this.dead = true;
      this.controlsEnabled = false;
      sample(Resources.ImpactMining).play();
    } else if (otherOwner instanceof Snowman) {
      this.collisionCount++;

      otherOwner.splat(this.vel);
    } else if (otherOwner instanceof SlolamSpeedup) {
      this.downhillSpeed *= 1.2;
      Resources.Powerup.play();
    }
  }

  override onCollisionEnd(): void {
    this.collisionCount--;
  }
}
