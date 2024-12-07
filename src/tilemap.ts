import { TileMap } from 'excalibur';
import { colliders, sprites } from './sprites';

export const tilemap = new TileMap({
  rows: 50,
  columns: 16,
  tileWidth: 16,
  tileHeight: 16,
  renderFromTopOfGraphic: true,
});

for (const tile of tilemap.tiles) {
  const background = (() => {
    if (tile.x === 0 || tile.x === tilemap.columns - 1)
      return Math.random() < 0.1 ? sprites.bankDetail : sprites.bankPlain;

    if (tile.x === 1) return sprites.bankLeft;
    if (tile.x === tilemap.columns - 2) return sprites.bankRight;

    return Math.random() < 0.05 ? sprites.pathDetail : sprites.pathPlain;
  })();

  const collider = colliders.get(background);

  tile.addGraphic(background);

  if (collider) {
    tile.solid = true;
    tile.addCollider(collider());
  }

  if (tile.y === tilemap.rows - 1) {
    if (tile.x === 0 || tile.x === tilemap.columns - 1) {
      tile.addGraphic(sprites.flagRedLarge);
    }
  }
}
