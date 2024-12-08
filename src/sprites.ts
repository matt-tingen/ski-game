import { SpriteSheet } from 'excalibur';
import { Resources } from './resources';

const spriteSheet = SpriteSheet.fromImageSource({
  image: Resources.Tilemap,
  grid: {
    rows: 7,
    columns: 12,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

const get = spriteSheet.getSprite.bind(spriteSheet);

export const sprites = {
  pathPlain: get(0, 0),
  bankRight: get(1, 0),
  bankPlain: get(2, 0),
  bankDetail: get(3, 0),
  bankLeft: get(4, 0),
  pathDetail: get(5, 0),

  rock: get(9, 6),
  snowman: get(9, 5),

  flagRedLarge: get(8, 1),
};
