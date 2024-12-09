import {
  Axis,
  BoundingBox,
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Keys,
  Scene,
  SceneActivationContext,
  TileMap,
  vec,
} from 'excalibur';
import seedRandom from 'seed-random';
import { LockToActorAxisOffsetCameraStrategy } from './LockToActorAxisOffsetCameraStrategy';
import { Player } from './player';
import { RaceTimer } from './RaceTimer';
import { Rock } from './rock';
import { getSeed } from './seed';
import { SlolamFlag } from './SlolamFlag';
import { Snowman } from './snowman';
import { createMap } from './tilemap';
import { zIndices } from './zIndices';

export class MyLevel extends Scene {
  private player!: Player;

  private easiness = 20;
  private tilemap!: TileMap;

  private done = false;
  private timer = new RaceTimer({ x: 100, y: 100 });

  override onInitialize(engine: Engine): void {
    const seed = getSeed();

    this.tilemap = createMap(seedRandom(seed));
    this.initObstacles(seed);

    this.player = new Player(vec(this.tilemap.width / 2, 16));

    this.tilemap.z = zIndices.tilemap;
    this.player.z = zIndices.player;

    this.add(this.tilemap);
    this.add(this.player);
    this.add(this.timer);
    this.camera.x = this.player.pos.x;

    this.camera.addStrategy(
      new LockToActorAxisOffsetCameraStrategy(this.player, Axis.Y, 0.2),
    );
    this.camera.strategy.limitCameraBounds(
      new BoundingBox({
        left: -Infinity,
        right: Infinity,
        top: this.tilemap.y,
        bottom: this.tilemap.y + this.tilemap.height,
      }),
    );
  }

  private initObstacles(seed: string) {
    const random = seedRandom(seed);
    const obstacleRandom = seedRandom(random().toString());
    const jiggleRandom = seedRandom(random().toString());
    const slolamRandom = seedRandom(random().toString());
    const slolamDirectionRandom = seedRandom(random().toString());

    for (const tile of this.tilemap.tiles) {
      if (tile.y > 8 && tile.y < this.tilemap.rows - 2) {
        const obstacleValue = obstacleRandom() * this.easiness;
        const slolamValue = slolamRandom();
        const jiggle = vec(
          Math.floor(jiggleRandom() * 16),
          Math.floor(jiggleRandom() * 16),
        );
        const direction = slolamDirectionRandom() > 0.5 ? 'right' : 'left';
        const pos = tile.pos.add(jiggle);

        if (slolamValue < 0.02) {
          const flag = new SlolamFlag(direction, pos);

          flag.z = zIndices.pickup;

          this.add(flag);
        } else if (obstacleValue < 0.08) {
          const rock = new Rock(pos);

          rock.z = zIndices.obstacle;

          this.add(rock);
        } else if (obstacleValue < 0.16) {
          const snowman = new Snowman(pos);

          snowman.z = zIndices.obstacle;

          this.add(snowman);
        }
      }
    }
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    this.timer.resume();
    document.getElementById('game-btns')?.classList.remove('hidden');
  }

  override onDeactivate(context: SceneActivationContext): void {
    this.timer.pause();
    document.getElementById('game-btns')?.classList.add('hidden');
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (
      (this.player.dead ||
        this.player.pos.y >= this.tilemap.pos.y + this.tilemap.height + 16) &&
      !this.done
    ) {
      this.done = true;
      this.timer.pause();
      this.player.controlsEnabled = false;
      this.player.dead = true;
      this.camera.zoomOverTime(engine.drawHeight / this.tilemap.height, 2000);
    }

    // this.camera.y = this.player.pos.y + engine.halfDrawHeight * 0.8;

    if (engine.input.keyboard.wasPressed(Keys.R)) {
      engine.goToScene('reset');
    }
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
