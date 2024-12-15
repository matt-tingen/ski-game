import { sample, sortBy, without } from 'es-toolkit';
import {
  Axis,
  BoundingBox,
  Color,
  Engine,
  Keys,
  Scene,
  SceneActivationContext,
  vec,
} from 'excalibur';
import seedRandom from 'seed-random';
import { FlagSpawn } from './flagSpawn';
import { LockToActorAxisOffsetCameraStrategy } from './LockToActorAxisOffsetCameraStrategy';
import { Player } from './player';
import { RaceTimer } from './RaceTimer';
import { withSeededRandom } from './random';
import { addRoom, ROOM_HEIGHT, roomNames } from './rooms';
import { getSeed } from './seed';
import { SlolamGate } from './SlolamGate';
import { Spawn } from './spawn';
import { Trail } from './trail';
import { zIndices } from './zIndices';

export class MyLevel extends Scene {
  private player!: Player;

  private roomCount = 15;

  private done = false;
  private timer = new RaceTimer({ x: 100, y: 100 });

  override onInitialize(engine: Engine): void {
    const seed = getSeed();

    this.initMap(seed);

    const spawn = this.actors.find((a) => a instanceof Spawn);
    if (!spawn) throw new Error('No spawn set');

    this.player = new Player(spawn.pos);
    this.player.z = zIndices.player;

    this.add(this.player);
    this.addTrails();
    this.add(this.timer);
    this.camera.x = this.player.pos.x;

    this.camera.addStrategy(
      new LockToActorAxisOffsetCameraStrategy(this.player, Axis.Y, 0.2),
    );
    this.camera.strategy.limitCameraBounds(
      new BoundingBox({
        left: -Infinity,
        right: Infinity,
        top: 0,
        bottom: this.mapBottom,
      }),
    );
  }

  private addTrails() {
    this.player.skis.forEach((target) => {
      this.add(
        new Trail({
          target,
          offset: vec(0, 0),
          smoothness: 0.1,
          thickness: 2,
          color: new Color(182, 201, 214),
          z: zIndices.trail,
          anchor: vec(0, 0),
          visible: true,
        }),
      );
    });
  }

  private get mapBottom() {
    return this.roomCount * ROOM_HEIGHT;
  }

  private initMap(seed: string) {
    const random = seedRandom(seed);
    const detailRandom = seedRandom(random().toString());
    const roomRandom = seedRandom(random().toString());
    const jiggleRandom = seedRandom(random().toString());
    const slolamRandom = seedRandom(random().toString());

    let i = 0;

    addRoom(this, detailRandom, i++, 'liftBg', 'lift');

    const eligibleRooms = without(roomNames, 'lift', 'liftBg', 'finish');

    while (i < this.roomCount - 1) {
      const rooms =
        i % 2
          ? []
          : [withSeededRandom(roomRandom, () => sample(eligibleRooms))];

      addRoom(this, detailRandom, i++, ...rooms);

      const flagSpawns = this.actors.filter((a) => a instanceof FlagSpawn);
      const spawn = withSeededRandom(slolamRandom, () => sample(flagSpawns));

      if (spawn) {
        const row = sortBy(
          flagSpawns.filter((fs) => fs.pos.y === spawn.pos.y),
          [(fs) => fs.pos.x],
        );

        const spawnIndex = row.indexOf(spawn);

        // Remove non-contiguous to the right
        for (let i = spawnIndex + 1; i < row.length; i++) {
          if (row[i].pos.x !== row[i - 1].pos.x + 1) {
            row.splice(i, row.length - i);
            break;
          }
        }

        // Remove non-contiguous to the left
        for (let i = spawnIndex - 1; i >= 0; i--) {
          if (row[i].pos.x !== row[i + 1].pos.x - 1) {
            row.splice(0, i);
            break;
          }
        }

        // Remove first spawn and adjacent
        const others = row.filter(
          (fs) => fs !== spawn && Math.abs(fs.pos.x - spawn.pos.x) > 1,
        );

        if (others.length) {
          const other = withSeededRandom(slolamRandom, () => sample(others));

          const center = vec((spawn.pos.x + other.pos.x) / 2, spawn.pos.y);
          const width = Math.abs(spawn.pos.x - other.pos.x);

          this.add(new SlolamGate(center, width));
        }
      }

      flagSpawns.forEach((a) => {
        this.remove(a);
      });
    }

    addRoom(this, detailRandom, i++, 'finish');
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    this.timer.resume();
    document.getElementById('game-btns')?.classList.remove('hidden');
  }

  override onDeactivate(context: SceneActivationContext): void {
    this.timer.pause();
    document.getElementById('game-btns')?.classList.add('hidden');
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (
      (this.player.dead || this.player.pos.y >= this.mapBottom + 16) &&
      !this.done
    ) {
      this.done = true;
      this.timer.pause();
      this.player.controlsEnabled = false;
      this.player.dead = true;
      this.camera.zoomOverTime(engine.drawHeight / this.mapBottom, 2000);
    }

    if (engine.input.keyboard.wasPressed(Keys.R)) {
      engine.goToScene('reset');
    }
  }
}
