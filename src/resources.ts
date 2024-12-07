import { TiledResource } from '@excaliburjs/plugin-tiled';
import { ImageSource, Loader, Sound } from 'excalibur';
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
import bankDetailPath from './images/bankDetail.png';
import bankPlainPath from './images/bankPlain.png';
import checkerPath from './images/checker.png';
import leftBankPath from './images/leftBank.png';
import pathDetailPath from './images/pathDetail.png';
import pathPlainPath from './images/pathPlain.png';
import rightBankPath from './images/rightBank.png';
import skier1downPath from './images/skier1down.png';
import skier1upPath from './images/skier1up.png';
import tilemapPath from './images/tilemap.png';
import level1Path from './tiled/level1.tmj';

export const Resources = {
  Skier1Up: new ImageSource(skier1upPath),
  Skier1Down: new ImageSource(skier1downPath),
  LeftBank: new ImageSource(leftBankPath),
  RightBank: new ImageSource(rightBankPath),
  BankDetail: new ImageSource(bankDetailPath),
  BankPlain: new ImageSource(bankPlainPath),
  PathDetail: new ImageSource(pathDetailPath),
  PathPlain: new ImageSource(pathPlainPath),
  Checker: new ImageSource(checkerPath),

  Tilemap: new ImageSource(tilemapPath),

  Level1: new TiledResource(level1Path),

  FootstepCarpet: [
    new Sound(footstepCarpet0Path),
    new Sound(footstepCarpet1Path),
    new Sound(footstepCarpet2Path),
    new Sound(footstepCarpet3Path),
    new Sound(footstepCarpet4Path),
  ],
  FootstepSnow: [
    new Sound(footstepSnow0Path),
    new Sound(footstepSnow1Path),
    new Sound(footstepSnow2Path),
    new Sound(footstepSnow3Path),
    new Sound(footstepSnow4Path),
  ],
  ImpactMining: [
    new Sound(impactMining0Path),
    new Sound(impactMining1Path),
    new Sound(impactMining2Path),
    new Sound(impactMining3Path),
    new Sound(impactMining4Path),
  ],
} as const;

export const loader = new Loader(Object.values(Resources).flat());
