import {
  CircleCollider,
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  PolygonCollider,
  Scene,
  SceneActivationContext,
  TileMap,
  vec,
} from 'excalibur';
import seedRandom from 'seed-random';
import { Player } from './player';
import { loader } from './resources';
import { Rock } from './rock';
import { Snowman } from './snowman';
import { sprites } from './sprites';
import { createMap } from './tilemap';
import { zIndices } from './zIndices';

export class MyLevel extends Scene {
  private player = new Player(vec(100, 64));

  private easiness = 2;
  private tilemap!: TileMap;

  private ms = 0;
  private start: Date | undefined;
  private done = false;

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game

    // const makeStrip = (y: number) => [
    //   new Bank(vec(0, y)),
    //   ...range(1, 10).map((i) => new Path(vec(i * 16, y))),
    //   new Bank(vec(11 * 16, y)),
    // ];

    // const tiles = range(0, 100).flatMap((i) => makeStrip(i * 16));

    // tiles.forEach((tile) => {
    //   this.add(tile);
    // });
    // console.log(Resources.Level1.layers);
    // Resources.Level1.addToScene(engine.currentScene);

    const seed = new Date().toISOString().split('T')[0];

    this.tilemap = createMap(seedRandom(seed));

    this.initObstacles(seed);

    this.tilemap.z = zIndices.tilemap;
    this.player.z = zIndices.player;

    this.add(this.tilemap);
    this.add(this.player);
    // this.camera.zoom  1;
    this.camera.x = this.player.pos.x;
    // this.camera.strategy.lockToActorAxis(player, Axis.Y);
  }

  private initObstacles(seed: string) {
    const random = seedRandom(seed);
    const obstacleRandom = seedRandom(random().toString());
    const jiggleRandom = seedRandom(random().toString());

    for (const tile of this.tilemap.tiles) {
      if (tile.y > 10) {
        const value = obstacleRandom() * this.easiness;
        const jiggle = vec(
          Math.floor(jiggleRandom() * 16),
          Math.floor(jiggleRandom() * 16),
        );

        if (value < 0.08) {
          const rock = new Rock(tile.pos.add(jiggle));

          rock.z = zIndices.obstacle;

          this.add(rock);
        } else if (value < 0.16) {
          const snowman = new Snowman(tile.pos.add(jiggle));

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
    this.start = new Date();
  }

  override onDeactivate(context: SceneActivationContext): void {
    this.recordTime();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  private recordTime() {
    const end = new Date();

    this.ms += end.valueOf() - this.start!.valueOf();
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (this.player.pos.y >= this.tilemap.pos.y + this.tilemap.height) {
      this.player.pos.y = this.tilemap.pos.y + this.tilemap.height;
      this.player.enabled = false;

      if (!this.done) {
        this.done = true;
        this.recordTime();

        console.log(`Time: ${this.ms / 1000}`);
      }
    }

    // Called after everything updates in the scene
    this.camera.y = this.player.pos.y + (engine.drawHeight / 2) * 0.8;
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
