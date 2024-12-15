import { Sound } from 'excalibur';
import type { SoundChannel } from './SoundChannel';

export class ControlledSound extends Sound {
  constructor(
    private channel: SoundChannel,
    ...paths: string[]
  ) {
    super(...paths);
    channel.add(this);
  }

  #instanceVolume = 1;

  public get instanceVolume() {
    return this.#instanceVolume;
  }

  public set instanceVolume(value: number) {
    this.#instanceVolume = value;
    this.update();
  }

  public update() {
    super.volume = this.channel.muted
      ? 0
      : this.instanceVolume * this.channel.volume;
  }
}
