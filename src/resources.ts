import { ImageSource, Loader } from 'excalibur';
import arcadeSongPath from './audio/8-bit-arcade-mode-158814.mp3';
import flagHitPath from './audio/flaghit.wav';
import footstepSnow0PathOgg from './audio/footstep_snow_000.ogg';
import footstepSnow0PathWav from './audio/footstep_snow_000.wav';
import footstepSnow1PathOgg from './audio/footstep_snow_001.ogg';
import footstepSnow1PathWav from './audio/footstep_snow_001.wav';
import footstepSnow2PathOgg from './audio/footstep_snow_002.ogg';
import footstepSnow2PathWav from './audio/footstep_snow_002.wav';
import footstepSnow3PathOgg from './audio/footstep_snow_003.ogg';
import footstepSnow3PathWav from './audio/footstep_snow_003.wav';
import footstepSnow4PathOgg from './audio/footstep_snow_004.ogg';
import footstepSnow4PathWav from './audio/footstep_snow_004.wav';
import impactMining0PathOgg from './audio/impactMining_000.ogg';
import impactMining0PathWav from './audio/impactMining_000.wav';
import impactMining1PathOgg from './audio/impactMining_001.ogg';
import impactMining1PathWav from './audio/impactMining_001.wav';
import impactMining2PathOgg from './audio/impactMining_002.ogg';
import impactMining2PathWav from './audio/impactMining_002.wav';
import impactMining3PathOgg from './audio/impactMining_003.ogg';
import impactMining3PathWav from './audio/impactMining_003.wav';
import impactMining4PathOgg from './audio/impactMining_004.ogg';
import impactMining4PathWav from './audio/impactMining_004.wav';
import powerupPath from './audio/powerup.wav';
import checkerPath from './images/checker.png';
import textTilemapPath from './images/textTilemap.png';
import tilemapPath from './images/tilemap.png';
import { SoundChannel } from './SoundChannel';

const defaultVolume = 0.5;
export const sfx = new SoundChannel('sfx', defaultVolume);
export const music = new SoundChannel('music', defaultVolume);

export const Resources = {
  Checker: new ImageSource(checkerPath),

  Tilemap: new ImageSource(tilemapPath),
  TextTilemap: new ImageSource(textTilemapPath),

  FootstepSnow: [
    sfx.from(footstepSnow0PathOgg, footstepSnow0PathWav),
    sfx.from(footstepSnow1PathOgg, footstepSnow1PathWav),
    sfx.from(footstepSnow2PathOgg, footstepSnow2PathWav),
    sfx.from(footstepSnow3PathOgg, footstepSnow3PathWav),
    sfx.from(footstepSnow4PathOgg, footstepSnow4PathWav),
  ],
  ImpactMining: [
    sfx.from(impactMining0PathOgg, impactMining0PathWav),
    sfx.from(impactMining1PathOgg, impactMining1PathWav),
    sfx.from(impactMining2PathOgg, impactMining2PathWav),
    sfx.from(impactMining3PathOgg, impactMining3PathWav),
    sfx.from(impactMining4PathOgg, impactMining4PathWav),
  ],

  ArcadeSong: music.from(arcadeSongPath),
  Powerup: sfx.from(powerupPath),
  // W=8000,f=851.528,v=46.528,V=558.333,t=127.083,T=0.172,_=0.043,d=249.113,D=0.106,p=1.342,a=0.6,A=1.9,b=0.3,r=2.6,s=4,S=9.317,z=Down,g=0.705,l=0.35
  FlagHit: sfx.from(flagHitPath),
} as const;

class CustomLoader extends Loader {
  protected override _playButtonStyles = '';
  protected override get _playButton() {
    const btn = super._playButton;

    btn.classList.add('nes-btn', 'is-success');

    return btn;
  }
}

export const loader = new CustomLoader(Object.values(Resources).flat());

loader.backgroundColor = 'transparent';
