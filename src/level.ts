import { groupBy, sample, without } from 'es-toolkit';
import {
  Axis,
  BoundingBox,
  clamp,
  Color,
  Engine,
  Keys,
  Scene,
  SceneActivationContext,
  vec,
} from 'excalibur';
import seedRandom from 'seed-random';
import { FlagSpawn } from './flagSpawn';
import { fetchLeaderboard, showLeaderboard } from './leaderboard';
import { LockToActorAxisOffsetCameraStrategy } from './LockToActorAxisOffsetCameraStrategy';
import { Player } from './player';
import { RaceTimer } from './RaceTimer';
import { withSeededRandom } from './random';
import {
  addRoom,
  ROOM_HEIGHT,
  ROOM_WIDTH,
  roomNames,
  TILE_SIZE,
} from './rooms';
import { getSeed } from './seed';
import { SlolamGate } from './SlolamGate';
import { Spawn } from './spawn';
import { Trail } from './trail';
import { zIndices } from './zIndices';

export class MyLevel extends Scene {
  private player!: Player;

  private roomCount = 16;

  private seed!: string;
  private done = false;
  private timer = new RaceTimer(document.getElementById('timer')!);

  override onInitialize(engine: Engine): void {
    this.seed = getSeed();

    this.initMap(this.seed);

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

    const resetBtn = document.getElementById('reset')!;

    resetBtn.classList.remove('hidden');
    resetBtn.addEventListener('click', () => {
      this.reset(engine);
    });
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
    }

    addRoom(this, detailRandom, i++, 'finish');

    this.addGates(slolamRandom);
  }

  private addGates(slolamRandom: () => number) {
    const flagSpawns = this.actors.filter((a) => a instanceof FlagSpawn);
    const rows = Object.values(groupBy(flagSpawns, (a) => a.pos.y));

    rows.forEach((row) => {
      if (slolamRandom() > 0.35) return;

      const spawnA = withSeededRandom(slolamRandom, () => sample(row));

      if (spawnA) {
        // Remove first spawn and adjacent
        const eligible = row.filter(
          (fs) =>
            fs !== spawnA && Math.abs(fs.pos.x - spawnA.pos.x) > TILE_SIZE,
        );

        if (eligible.length) {
          const spawnB = withSeededRandom(slolamRandom, () => sample(eligible));

          const center = vec((spawnA.pos.x + spawnB.pos.x) / 2, spawnA.pos.y);
          const width = Math.abs(spawnA.pos.x - spawnB.pos.x);

          this.add(new SlolamGate(center, width));
        }
      }
    });

    flagSpawns.forEach((spawn) => {
      this.remove(spawn);
    });
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    void fetchLeaderboard(this.seed);
    this.timer.resume();
  }

  override onDeactivate(context: SceneActivationContext): void {
    this.timer.pause();
  }

  // eslint-disable-next-line class-methods-use-this
  private reset(engine: Engine) {
    engine.goToScene('reset');
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    const finished = this.player.pos.y >= this.mapBottom + 16;

    if ((this.player.dead || finished) && !this.done) {
      this.done = true;
      this.timer.pause();
      this.player.controlsEnabled = false;
      this.player.dead = true;

      void this.camera.zoomOverTime(engine.drawHeight / this.mapBottom, 2000);

      if (finished) {
        showLeaderboard(this.seed, this.timer.ms);
      }
    }

    const clampedX = clamp(this.player.pos.x, 8, ROOM_WIDTH - 8);

    if (this.player.pos.x !== clampedX) {
      this.player.pos = vec(clampedX, this.player.pos.y);
    }

    if (engine.input.keyboard.wasPressed(Keys.R)) {
      this.reset(engine);
    }
  }
}
