import {
  Axis,
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
} from 'excalibur';
import { Player } from './player';
import { tilemap } from './tilemap';

export class MyLevel extends Scene {
  private player = new Player(vec(100, 64));

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

    this.add(tilemap);
    this.add(this.player);
    // this.camera.zoom  1;
    this.camera.x = this.player.pos.x;
    // this.camera.strategy.lockToActorAxis(player, Axis.Y);
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (this.player.pos.y >= tilemap.pos.y + tilemap.height) {
      this.player.pos.y = tilemap.pos.y + tilemap.height;
      this.player.enabled = false;
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
