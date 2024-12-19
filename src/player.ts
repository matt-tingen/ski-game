import { sample, sumBy } from 'es-toolkit';
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
  Entity,
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
  private pastSlowers = new Set<Entity>();
  private activeSlowers = new Set<Entity>();

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
    const upSprite = Resources.SkierUp.toSprite();
    const downSprite = Resources.SkierDown.toSprite();

    this.graphics.add('up', upSprite);
    this.graphics.add('down', downSprite);

    this.skis.forEach((ski) => {
      this.addChild(ski);
    });

    this.graphics.add(
      'push',
      new Animation({
        strategy: AnimationStrategy.Loop,
        frames: [
          {
            graphic: downSprite,
            duration: 400,
          },
          {
            graphic: upSprite,
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

    const pressed = (key: Keys) =>
      engine.input.keyboard.isHeld(key) ||
      engine.input.keyboard.wasPressed(key);

    if (
      this.controlsEnabled &&
      (pressed(Keys.A) ||
        pressed(Keys.Left) ||
        leftTurnButton.hasAttribute('data-active'))
    ) {
      this.lateralSpeed += delta(Config.playerTurnSpeed);
    } else if (
      this.controlsEnabled &&
      (pressed(Keys.D) ||
        pressed(Keys.Right) ||
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

    let collisionCount = sumBy(Array.from(this.activeSlowers), (entity) => {
      if (entity instanceof Snowman) return 2;
      if (entity instanceof Grass) return 1;

      return 0;
    });

    this.activeSlowers.forEach((entity) => {
      this.pastSlowers.add(entity);
    });
    this.activeSlowers.clear();

    if (collisionCount) {
      const pre = this.downhillSpeed;

      for (; collisionCount > 0; collisionCount--) {
        this.downhillSpeed -=
          Config.playerCollisionFriction * this.downhillSpeed;
      }

      console.log({ pre, post: this.downhillSpeed });
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

  private addSlower(actor: Actor) {
    if (!this.pastSlowers.has(actor)) {
      this.activeSlowers.add(actor);
    }
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
      this.addSlower(otherOwner);
      otherOwner.splat(this.vel);
    } else if (otherOwner instanceof Grass) {
      this.addSlower(otherOwner);

      // TODO: sound
    } else if (otherOwner instanceof SlolamSpeedup) {
      this.downhillSpeed *= 1.2;
      Resources.Powerup.play();
    }
  }
}
