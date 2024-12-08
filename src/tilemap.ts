import { TileMap } from 'excalibur';
import seedRandom from 'seed-random';
import { Resources } from './resources';
import { sprites } from './sprites';

export const createMap = (random: () => number) => {
  const tilemap = new TileMap({
    rows: 60,
    columns: 16,
    tileWidth: 16,
    tileHeight: 16,
    renderFromTopOfGraphic: true,
  });

  const detail = seedRandom(random().toString());

  for (const tile of tilemap.tiles) {
    const background = (() => {
      if (tile.y === tilemap.rows - 1) return Resources.Checker.toSprite();

      if (tile.x === 0 || tile.x === tilemap.columns - 1)
        return detail() < 0.1 ? sprites.bankDetail : sprites.bankPlain;

      if (tile.x === 1) return sprites.bankLeft;
      if (tile.x === tilemap.columns - 2) return sprites.bankRight;

      return detail() < 0.05 ? sprites.pathDetail : sprites.pathPlain;
    })();

    tile.addGraphic(background);
  }

  return tilemap;
};
