import { PolygonCollider, vec, Vector } from 'excalibur';

export class RectangleCollider extends PolygonCollider {
  constructor(width: number, height: number, offset?: Vector) {
    super({
      points: [vec(0, 0), vec(0, height), vec(width, height), vec(width, 0)],
      offset,
    });
  }
}
