import { ImageSource, Loader } from 'excalibur';
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
import { ControlledSound } from './ControlledSound';
import checkerPath from './images/checker.png';
import textTilemapPath from './images/textTilemap.png';
import tilemapPath from './images/tilemap.png';

export const Resources = {
  Checker: new ImageSource(checkerPath),

  Tilemap: new ImageSource(tilemapPath),
  TextTilemap: new ImageSource(textTilemapPath),

  FootstepCarpet: [
    new ControlledSound(footstepCarpet0Path),
    new ControlledSound(footstepCarpet1Path),
    new ControlledSound(footstepCarpet2Path),
    new ControlledSound(footstepCarpet3Path),
    new ControlledSound(footstepCarpet4Path),
  ],
  FootstepSnow: [
    new ControlledSound(footstepSnow0Path),
    new ControlledSound(footstepSnow1Path),
    new ControlledSound(footstepSnow2Path),
    new ControlledSound(footstepSnow3Path),
    new ControlledSound(footstepSnow4Path),
  ],
  ImpactMining: [
    new ControlledSound(impactMining0Path),
    new ControlledSound(impactMining1Path),
    new ControlledSound(impactMining2Path),
    new ControlledSound(impactMining3Path),
    new ControlledSound(impactMining4Path),
  ],

  Powerup: new ControlledSound(powerupPath),
  // W=8000,f=851.528,v=46.528,V=558.333,t=127.083,T=0.172,_=0.043,d=249.113,D=0.106,p=1.342,a=0.6,A=1.9,b=0.3,r=2.6,s=4,S=9.317,z=Down,g=0.705,l=0.35
  FlagHit: new ControlledSound(flagHitPath),
} as const;

export const loader = new Loader(Object.values(Resources).flat());
