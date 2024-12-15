import { music, sfx } from './resources';
import { SoundChannel } from './SoundChannel';

const initMuteButton = (id: string, channel: SoundChannel) => {
  const btn = document.getElementById(id) as HTMLButtonElement;

  btn.classList.toggle('is-primary', !channel.muted);
  btn.addEventListener('click', () => {
    btn.classList.toggle('is-primary');
    // eslint-disable-next-line no-param-reassign
    channel.muted = !channel.muted;
  });
};

export const initVolume = () => {
  const input = document.getElementById('volume-input') as HTMLInputElement;

  const progress = document.getElementById(
    'volume-progress',
  ) as HTMLProgressElement;

  input.addEventListener('input', () => {
    const value = input.valueAsNumber;

    sfx.volume = value;
    music.volume = value;
    progress.value = value;
  });

  input.value = sfx.volume.toString();
  progress.value = sfx.volume;

  initMuteButton('sfx', sfx);
  initMuteButton('music', music);
};
