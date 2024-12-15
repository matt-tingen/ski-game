import {
  Color,
  GraphicsGroup,
  GraphicsGrouping,
  Line,
  Vector,
} from 'excalibur';

export interface PolylineConfig {
  points?: Vector[];
  color?: Color;
  thickness?: number;
}

const isColinear = (a: Vector, b: Vector, c: Vector, allowedError = 0.0001) => {
  const diff1 = b.sub(a);
  const diff2 = c.sub(b);

  return Math.abs(diff1.cross(diff2)) <= allowedError;
};

export class Polyline extends GraphicsGroup {
  private points: Vector[];
  public color?: Color;
  public thickness?: number;

  constructor(config: PolylineConfig = {}) {
    super({ members: [] });
    this.points = config.points ?? [];
    this.color = config.color;
    this.thickness = config.thickness;
    this.update();
  }

  private update() {
    if (this.points.length > 1) {
      this.members.push(
        ...Polyline.makeMembers(this.points.at(-2)!, this.points.at(-1)!, {
          color: this.color,
          thickness: this.thickness,
        }),
      );
    }
  }

  private static makeMembers(
    a: Vector,
    b: Vector,
    config: PolylineConfig,
  ): GraphicsGrouping[] {
    const line = new Line({
      start: Vector.Zero,
      end: b.sub(a),
      color: config.color,
      thickness: config.thickness,
    });

    const members: GraphicsGrouping[] = [
      {
        graphic: line,
        offset: a,
      },
    ];

    return members;
  }

  addPoint(point: Vector) {
    const prev = this.points.at(-1);
    const prevPrev = this.points.at(-2);

    if (prev?.equals(point)) return;

    if (prev && prevPrev && isColinear(prev, prevPrev, point)) {
      this.points.splice(-1, 1, point.clone());
    } else {
      this.points.push(point.clone());
    }

    this.update();
  }
}
