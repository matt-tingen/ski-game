import { Actor, ActorArgs, clamp, Vector } from 'excalibur';
import { Polyline, PolylineConfig } from './polyline';

interface TrailArgs extends Omit<PolylineConfig, 'points'> {
  target: Actor;
  smoothness?: number;
  offset?: Vector;
}

export class Trail extends Actor {
  public target: Actor;
  public smoothness: number;
  public enabled = true;

  private polyline: Polyline;
  private accumulator = 0;
  private trailOffset?: Vector;

  constructor({
    smoothness = 1,
    color,
    thickness,
    target,
    offset,
    ...rest
  }: TrailArgs & ActorArgs) {
    super(rest);

    this.pos = target.pos;
    this.smoothness = smoothness;
    this.target = target;
    this.trailOffset = offset;

    this.polyline = new Polyline({
      color,
      thickness,
    });
  }

  onInitialize(): void {
    this.graphics.add(this.polyline);
  }

  onPostUpdate(): void {
    const targetPos = this.target.globalPos.clone();

    if (this.enabled) {
      this.accumulator += clamp(this.smoothness, 0, 1);

      if (this.accumulator >= 1) {
        this.accumulator -= 1;

        this.polyline.addPoint(targetPos);
      }
    }

    this.pos = targetPos;
    this.offset = targetPos.negate().add(this.trailOffset ?? Vector.Zero);
  }
}
