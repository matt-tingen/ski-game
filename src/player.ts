import { sample } from 'es-toolkit';
import {
  Actor,
  clamp,
  Collider,
  CollisionContact,
  CollisionGroupManager,
  CollisionType,
  Engine,
  Keys,
  ParticleEmitter,
  Side,
  Vector,
} from 'excalibur';
import { Config } from './Config';
import { Resources } from './resources';
import { Rock } from './rock';
import { Snowman } from './snowman';

// Export the collision group, useful for referencing in other actors
export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends Actor {
  public enabled = true;
  public dead = false;

  private downhillSpeed = Config.playerInitialDownhillSpeed;
  private lateralSpeed = 0;
  private collisionCount = 0;

  private obstacleDisplacement = Vector.Zero.clone();

  constructor(pos: Vector) {
    super({
      name: 'Player',
      pos,
      radius: 6,
      collisionGroup: PlayerCollisionGroup,
      collisionType: CollisionType.Passive,
    });
  }

  override onInitialize() {
    this.graphics.add(Resources.Skier1Up.toSprite());
  }

  override update(engine: Engine, elapsedMs: number): void {
    if (!this.enabled) {
      this.vel = Vector.Zero;

      return;
    }

    const delta = (value: number) => value * (elapsedMs / 1000);

    if (
      engine.input.keyboard.isHeld(Keys.A) ||
      engine.input.keyboard.isHeld(Keys.Left)
    ) {
      this.lateralSpeed += delta(Config.playerTurnSpeed);
    } else if (
      engine.input.keyboard.isHeld(Keys.D) ||
      engine.input.keyboard.isHeld(Keys.Right)
    ) {
      this.lateralSpeed -= delta(Config.playerTurnSpeed);
    } else {
      this.lateralSpeed +=
        Math.min(
          Math.abs(this.lateralSpeed),
          delta(Config.playerLateralFriction),
        ) * -Math.sign(this.lateralSpeed);
    }

    if (engine.input.keyboard.wasPressed(Keys.Space)) {
      // this.
    }

    this.lateralSpeed = clamp(
      this.lateralSpeed,
      -Config.playerMaxTurn,
      Config.playerMaxTurn,
    );

    if (this.collisionCount) {
      for (; this.collisionCount > 0; this.collisionCount--) {
        console.log(this.collisionCount);
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
      this.enabled = false;
      sample(Resources.ImpactMining).play();
    } else if (otherOwner instanceof Snowman) {
      this.collisionCount++;

      otherOwner.splat(this.vel);
    }
  }

  override onCollisionEnd(): void {
    this.collisionCount--;
  }
}
