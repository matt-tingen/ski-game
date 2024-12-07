import {
  CircleCollider,
  PolygonCollider,
  TileMap,
  vec,
  Vector,
} from 'excalibur';
import { seed } from './random';
import { sprites } from './sprites';

export const createMap = (easiness: number) => {
  const tilemap = new TileMap({
    rows: 100,
    columns: 16,
    tileWidth: 16,
    tileHeight: 16,
    renderFromTopOfGraphic: true,
  });

  const obstacle = seed('tilemap-obstacle');
  const detail = seed('tilemap-detail');

  class RectangleCollider extends PolygonCollider {
    constructor(width: number, height: number, offset?: Vector) {
      super({
        points: [vec(0, 0), vec(0, height), vec(width, height), vec(width, 0)],
        offset,
      });
    }
  }

  for (const tile of tilemap.tiles) {
    const background = (() => {
      if (tile.x === 0 || tile.x === tilemap.columns - 1)
        return detail() < 0.1 ? sprites.bankDetail : sprites.bankPlain;

      if (tile.x === 1) return sprites.bankLeft;
      if (tile.x === tilemap.columns - 2) return sprites.bankRight;

      return detail() < 0.05 ? sprites.pathDetail : sprites.pathPlain;
    })();

    tile.addGraphic(background);

    if (tile.y > 10) {
      const value = obstacle() * easiness;

      if (value < 0.08) {
        tile.addGraphic(sprites.rock);
        tile.addCollider(
          new PolygonCollider({ points: [vec(8, 0), vec(16, 16), vec(0, 16)] }),
        );
      } else if (value < 0.16) {
        tile.addGraphic(sprites.snowman);
        tile.addCollider(new CircleCollider({ radius: 6, offset: vec(0, 4) }));
      }
    }

    if (tile.y === tilemap.rows - 1) {
      if (tile.x === 0 || tile.x === tilemap.columns - 1) {
        tile.addGraphic(sprites.flagRedLarge);
      }
    }
  }

  tilemap.getTile(0, 0)!.addCollider(new RectangleCollider(24, tilemap.height));
  tilemap
    .getTile(tilemap.columns - 1, 0)!
    .addCollider(new RectangleCollider(24, tilemap.height, vec(-24, 0)));

  return tilemap;
};
