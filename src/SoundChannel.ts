import { clamp } from 'excalibur';
import { ControlledSound } from './ControlledSound';

const getVolumeFromStorage = (key: string) => {
  const storageValue = localStorage.getItem(key);

  if (storageValue === null) return storageValue;

  const parsed = Number(storageValue);

  return Number.isNaN(parsed) ? null : clamp(parsed, 0, 1);
};

export class SoundChannel {
  private sounds = new Set<ControlledSound>();
  private volumeStorageKey: string;
  private mutedStorageKey: string;

  constructor(
    storagePrefix: string,
    private defaultVolume = 1,
  ) {
    this.volumeStorageKey = `${storagePrefix}-volume`;
    this.mutedStorageKey = `${storagePrefix}-muted`;
  }

  public from(...paths: string[]) {
    return new ControlledSound(this, ...paths);
  }

  public add(sound: ControlledSound) {
    this.sounds.add(sound);
    sound.update();
  }

  private update() {
    Array.from(this.sounds).forEach((sound) => {
      sound.update();
    });
  }

  public get volume() {
    return getVolumeFromStorage(this.volumeStorageKey) ?? this.defaultVolume;
  }

  public set volume(value: number) {
    localStorage.setItem(this.volumeStorageKey, value.toString());
    this.update();
  }

  public get muted() {
    return Boolean(localStorage.getItem(this.mutedStorageKey));
  }

  public set muted(isMuted: boolean) {
    if (isMuted) {
      localStorage.setItem(this.mutedStorageKey, 'true');
    } else {
      localStorage.removeItem(this.mutedStorageKey);
    }

    this.update();
  }
}
