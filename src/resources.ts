import { ImageSource, Loader } from 'excalibur';
import spaceSongPath from './audio/8-bit-space-123218.mp3';
import flagHitPath from './audio/flaghit.wav';
import footstepCarpet0Path from './audio/footstep_carpet_000.ogg';
import footstepCarpet1Path from './audio/footstep_carpet_001.ogg';
import footstepCarpet2Path from './audio/footstep_carpet_002.ogg';
import footstepCarpet3Path from './audio/footstep_carpet_003.ogg';
import footstepCarpet4Path from './audio/footstep_carpet_004.ogg';
import footstepSnow0Path from './audio/footstep_snow_000.ogg';
import footstepSnow1Path from './audio/footstep_snow_001.ogg';
import footstepSnow2Path from './audio/footstep_snow_002.ogg';
import footstepSnow3Path from './audio/footstep_snow_003.ogg';
import footstepSnow4Path from './audio/footstep_snow_004.ogg';
import impactMining0Path from './audio/impactMining_000.ogg';
import impactMining1Path from './audio/impactMining_001.ogg';
import impactMining2Path from './audio/impactMining_002.ogg';
import impactMining3Path from './audio/impactMining_003.ogg';
import impactMining4Path from './audio/impactMining_004.ogg';
import powerupPath from './audio/powerup.wav';
import checkerPath from './images/checker.png';
import textTilemapPath from './images/textTilemap.png';
import tilemapPath from './images/tilemap.png';
import { SoundChannel } from './SoundChannel';

export const sfx = new SoundChannel('sfx');
export const music = new SoundChannel('music');

export const Resources = {
  Checker: new ImageSource(checkerPath),

  Tilemap: new ImageSource(tilemapPath),
  TextTilemap: new ImageSource(textTilemapPath),

  FootstepCarpet: [
    sfx.from(footstepCarpet0Path),
    sfx.from(footstepCarpet1Path),
    sfx.from(footstepCarpet2Path),
    sfx.from(footstepCarpet3Path),
    sfx.from(footstepCarpet4Path),
  ],
  FootstepSnow: [
    sfx.from(footstepSnow0Path),
    sfx.from(footstepSnow1Path),
    sfx.from(footstepSnow2Path),
    sfx.from(footstepSnow3Path),
    sfx.from(footstepSnow4Path),
  ],
  ImpactMining: [
    sfx.from(impactMining0Path),
    sfx.from(impactMining1Path),
    sfx.from(impactMining2Path),
    sfx.from(impactMining3Path),
    sfx.from(impactMining4Path),
  ],

  SpaceSong: music.from(spaceSongPath),
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
