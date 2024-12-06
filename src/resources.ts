import { TiledResource } from '@excaliburjs/plugin-tiled';
import { ImageSource, Loader } from 'excalibur';
import bankDetailPath from './images/bankDetail.png';
import bankPlainPath from './images/bankPlain.png';
import leftBankPath from './images/leftBank.png';
import pathDetailPath from './images/pathDetail.png';
import pathPlainPath from './images/pathPlain.png';
import rightBankPath from './images/rightBank.png';
import skier1downPath from './images/skier1down.png';
import skier1upPath from './images/skier1up.png';
import level1Path from './tiled/level1.tmx';

export const Resources = {
  Skier1Up: new ImageSource(skier1upPath),
  Skier1Down: new ImageSource(skier1downPath),
  LeftBank: new ImageSource(leftBankPath),
  RightBank: new ImageSource(rightBankPath),
  BankDetail: new ImageSource(bankDetailPath),
  BankPlain: new ImageSource(bankPlainPath),
  PathDetail: new ImageSource(pathDetailPath),
  PathPlain: new ImageSource(pathPlainPath),

  Level1: new TiledResource(level1Path),
} as const;

export const loader = new Loader({ loadables: Object.values(Resources) });
