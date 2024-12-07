import { sample } from 'es-toolkit';
import {
  Actor,
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
import { Config } from './Config';
import { Resources } from './resources';
import { Rock } from './rock';
import { Snowman } from './snowman';

// Export the collision group, useful for referencing in other actors
export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends Actor {
  public controlsEnabled = true;
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
    this.addWakeEmitter(vec(-4, 0));
    this.addWakeEmitter(vec(4, 0));
  }

  private addWakeEmitter(pos: Vector) {
    const emitter = new ParticleEmitter({
      pos,
      emitRate: 200,
      particle: {
        startSize: 2,
        endSize: 2,
        beginColor: Color.White,
        endColor: Color.White,
        opacity: 0.8,
        fade: true,
        life: 4000,
      },
    });

    this.addChild(emitter);
  }

  override update(engine: Engine, elapsedMs: number): void {
    if (this.dead) {
      this.vel = Vector.Zero;

      return;
    }

    const delta = (value: number) => value * (elapsedMs / 1000);

    if (
      (this.controlsEnabled && engine.input.keyboard.isHeld(Keys.A)) ||
      engine.input.keyboard.isHeld(Keys.Left)
    ) {
      this.lateralSpeed += delta(Config.playerTurnSpeed);
    } else if (
      (this.controlsEnabled && engine.input.keyboard.isHeld(Keys.D)) ||
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

    if (this.controlsEnabled && engine.input.keyboard.wasPressed(Keys.Space)) {
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
      this.controlsEnabled = false;
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
