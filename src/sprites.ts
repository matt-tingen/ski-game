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

  treeTop: get(6, 0),
  treeBottom: get(6, 1),
  tree: get(6, 2),
  grass: get(7, 2),

  rock: get(9, 6),
  snowman: get(9, 5),

  flagRedSmall: get(8, 0),
  flagRedLarge: get(8, 1),
  flagBlueSmall: get(9, 0),
  flagBlueLarge: get(9, 1),

  skierGreenDown: get(10, 5),
  skierGreenUp: get(11, 5),
  skierPinkDown: get(10, 6),
  skierPinkUp: get(11, 6),

  liftPoleBase: get(6, 5),
  liftPoleShaft: get(6, 4),
  liftPoleTop: get(6, 3),
  liftLine: get(10, 3),
  liftLineChair: get(9, 3),
  liftChair: get(9, 4),
  liftChairShadow: get(0, 4),
  liftLineShadow: get(5, 4),
};
