import { SpriteFont, SpriteSheet } from 'excalibur';
import { Resources } from './resources';

const spriteSheet = SpriteSheet.fromImageSource({
  image: Resources.TextTilemap,
  grid: {
    rows: 4,
    columns: 12,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

export const font = new SpriteFont({
  spriteSheet,
  alphabet: '0123456789:.abcdefghijklmnopqrstuvwxyz!#$%+-*/= ',
  caseInsensitive: true,
  spacing: -4,
});
