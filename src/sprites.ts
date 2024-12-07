import {
  CircleCollider,
  Collider,
  PolygonCollider,
  Sprite,
  SpriteSheet,
  vec,
} from 'excalibur';
import { Resources } from './resources';

const spriteSheet = SpriteSheet.fromImageSource({
  image: Resources.Tilemap,
  grid: {
    rows: 11,
    columns: 12,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

const get = spriteSheet.getSprite.bind(spriteSheet);

export const sprites = {
  bankPlain: get(0, 0),
  bankLeft: get(1, 0),
  pathPlain: get(2, 0),
  pathDetail: get(3, 0),
  bankRight: get(4, 0),
  bankDetail: get(5, 0),

  flagRedLarge: get(8, 1),
};

const fullSquare = () =>
  new PolygonCollider({
    points: [vec(0, 0), vec(0, 16), vec(16, 16), vec(16, 0)],
  });

const halfSquare = (offset: number) =>
  new PolygonCollider({
    points: [vec(0, 0), vec(0, 16), vec(8, 16), vec(8, 0)],
    offset: vec(offset, 0),
  });

const leftHalf = () => halfSquare(0);
const rightHalf = () => halfSquare(8);

export const colliders = new Map<Sprite, () => Collider>([
  [sprites.bankPlain, fullSquare],
  [sprites.bankDetail, fullSquare],
  [sprites.bankLeft, leftHalf],
  [sprites.bankRight, rightHalf],
]);