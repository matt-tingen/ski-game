import { TileMap } from 'excalibur';
import { colliders, sprites } from './sprites';

export const tilemap = new TileMap({
  rows: 100,
  columns: 16,
  tileWidth: 16,
  tileHeight: 16,
});

for (const tile of tilemap.tiles) {
  const graphic = (() => {
    if (tile.x === 0 || tile.x === tilemap.columns - 1)
      return Math.random() < 0.1 ? sprites.bankDetail : sprites.bankPlain;

    if (tile.x === 1) return sprites.bankLeft;
    if (tile.x === tilemap.columns - 2) return sprites.bankRight;

    return Math.random() < 0.05 ? sprites.pathDetail : sprites.pathPlain;
  })();

  const collider = colliders.get(graphic);

  tile.addGraphic(graphic);
  if (collider) tile.addCollider(collider);
}
