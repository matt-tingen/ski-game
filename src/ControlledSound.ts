import { clamp, Sound } from 'excalibur';

const volumeStorageKey = 'global-volume';
const mutedStorageKey = 'muted';
const defaultGlobalVolume = 1;

const getVolumeFromStorage = () => {
  const storageValue = localStorage.getItem(volumeStorageKey);

  if (storageValue === null) return storageValue;

  const parsed = Number(storageValue);

  return Number.isNaN(parsed) ? null : clamp(parsed, 0, 1);
};

export class ControlledSound extends Sound {
  static #globalVolume = getVolumeFromStorage() ?? defaultGlobalVolume;

  static get globalVolume() {
    return ControlledSound.#globalVolume;
  }

  static set globalVolume(value: number) {
    this.#globalVolume = clamp(value, 0, 1);
    localStorage.setItem(volumeStorageKey, this.#globalVolume.toString());
  }

  static #muted = Boolean(localStorage.getItem(mutedStorageKey));

  static get muted() {
    return this.#muted;
  }

  static set muted(isMuted: boolean) {
    this.#muted = isMuted;

    if (isMuted) {
      localStorage.setItem(mutedStorageKey, 'true');
    } else {
      localStorage.removeItem(mutedStorageKey);
    }
  }

  get volume() {
    return ControlledSound.muted
      ? 0
      : super.volume * ControlledSound.globalVolume;
  }

  set volume(value: number) {
    super.volume = value;
  }
}
