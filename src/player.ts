import {
  Actor,
  clamp,
  CollisionGroupManager,
  CollisionType,
  Engine,
  Keys,
  Vector,
} from 'excalibur';
import { Config } from './Config';
import { Resources } from './resources';

// Export the collision group, useful for referencing in other actors
export const PlayerCollisionGroup = CollisionGroupManager.create('player');

export class Player extends Actor {
  private downhillSpeed = Config.playerInitialDownhillSpeed;
  private lateralSpeed = 0;
  private collisionCount = 0;

  constructor(pos: Vector) {
    super({
      name: 'Player',
      pos,
      width: 16,
      height: 16,
      collisionGroup: PlayerCollisionGroup,
      collisionType: CollisionType.Passive,
    });
  }

  override onInitialize() {
    this.graphics.add(Resources.Skier1Up.toSprite());
  }

  override update(engine: Engine, elapsedMs: number): void {
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
      this.downhillSpeed -= delta(
        Config.playerCollisionFriction * this.downhillSpeed,
      );
    } else {
      this.downhillSpeed += delta(Config.playerDownhillAcceleration);
    }

    this.vel = Vector.Down.clone()
      .scale(this.downhillSpeed)
      .add(Vector.Left.clone().scale(this.lateralSpeed));

    this.rotation = this.vel.toAngle() - Math.PI / 2;
  }

  override onCollisionStart(): void {
    this.collisionCount++;
  }

  override onCollisionEnd(): void {
    this.collisionCount--;
  }
}
