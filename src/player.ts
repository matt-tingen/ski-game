import { sample } from 'es-toolkit';
import {
  Actor,
  Animation,
  AnimationStrategy,
  clamp,
  Collider,
  CollisionContact,
  CollisionGroupManager,
  CollisionType,
  Engine,
  Keys,
  Side,
  vec,
  Vector,
} from 'excalibur';
import { Config } from './Config';
import { leftTurnButton, rightTurnButton } from './elements';
import { Grass } from './grass';
import { Resources } from './resources';
import { Rock } from './rock';
import { Ski } from './ski';
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
  public readonly skis = [new Ski(vec(-4, 0)), new Ski(vec(4, 0))];

  private downhillSpeed = Config.playerInitialDownhillSpeed;
  private lateralSpeed = 0;
  private collisionCount = 0;

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

    this.skis.forEach((ski) => {
      this.addChild(ski);
    });

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
        leftTurnButton.hasAttribute('data-active'))
    ) {
      this.lateralSpeed += delta(Config.playerTurnSpeed);
    } else if (
      this.controlsEnabled &&
      (engine.input.keyboard.isHeld(Keys.D) ||
        engine.input.keyboard.isHeld(Keys.Right) ||
        rightTurnButton.hasAttribute('data-active'))
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
      this.collisionCount += 2;

      otherOwner.splat(this.vel);
    } else if (otherOwner instanceof Grass) {
      this.collisionCount++;

      // TODO: sound
    } else if (otherOwner instanceof SlolamSpeedup) {
      this.downhillSpeed *= 1.2;
      Resources.Powerup.play();
    }
  }

  override onCollisionEnd(): void {
    this.collisionCount--;
  }
}
