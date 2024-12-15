import { keyBy } from 'es-toolkit';
import { Scene, Sprite, TileMap, vec } from 'excalibur';
import { FlagSpawn } from './flagSpawn';
import map from './map.json';
import { Resources } from './resources';
import { Rock } from './rock';
import { Spawn } from './spawn';
import { sprites } from './sprites';
import { zIndices } from './zIndices';

const entityMap = [
  Rock,
  Spawn,
  Resources.Checker.toSprite(),
  sprites.liftPoleShaft,
  sprites.liftPoleTop,
  sprites.liftLine,
  sprites.liftLineChair,
  sprites.liftChair,
  sprites.liftPoleBase,
  sprites.liftLineShadow,
  sprites.liftChairShadow,
  FlagSpawn,
];

const { mapHeight: roomHeight, mapWidth: roomWidth, tileSize } = map;

const tileCenter = vec(tileSize / 2, tileSize / 2);
export const TILE_SIZE = tileSize;
export const ROOM_WIDTH = roomWidth * tileSize;
export const ROOM_HEIGHT = roomHeight * tileSize;

const layersByName = keyBy(map.layers, (l) => l.name);

export const roomNames = Object.keys(layersByName);

type Layer = (typeof map)['layers'][number];

const addLayer = (scene: Scene, tilemap: TileMap, layer: Layer) => {
  layer.tiles.forEach(({ id, x, y }) => {
    const tile = tilemap.getTile(x, y)!;
    const entity = entityMap[Number(id)]!;

    if (entity instanceof Sprite) {
      tile.addGraphic(entity);
    } else {
      // eslint-disable-next-line new-cap
      scene.add(new entity(tile.pos.add(tileCenter)));
    }
  });
};

export const addRoom = (
  scene: Scene,
  random: () => number,
  positionIndex: number,
  ...roomNames: string[]
) => {
  const pos = vec(0, positionIndex * ROOM_HEIGHT);

  const tilemap = new TileMap({
    pos,
    rows: roomHeight,
    columns: roomWidth,
    tileWidth: tileSize,
    tileHeight: tileSize,
    renderFromTopOfGraphic: true,
  });

  tilemap.z = zIndices.tilemap;

  for (const tile of tilemap.tiles) {
    tile.addGraphic(random() < 0.1 ? sprites.bankDetail : sprites.bankPlain);
  }

  scene.add(tilemap);

  roomNames.forEach((name) => {
    const layer = layersByName[name];

    if (!layer) throw new Error(`Room not defined: "${name}"`);

    addLayer(scene, tilemap, layer);
  });
};
