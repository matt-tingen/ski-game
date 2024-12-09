import { Actor, Axis, Camera, CameraStrategy, Engine, vec } from 'excalibur';

export class LockToActorAxisOffsetCameraStrategy
  implements CameraStrategy<Actor>
{
  constructor(
    public target: Actor,
    public axis: Axis,
    public screenPercentage: number,
  ) {}

  action(target: Actor, cam: Camera, engine: Engine) {
    const { center } = target;
    const currentFocus = cam.getFocus();

    if (this.axis === Axis.X) {
      return vec(
        center.x + engine.drawWidth * (1 - (this.screenPercentage + 0.5)),
        currentFocus.y,
      );
    }

    return vec(
      currentFocus.x,
      center.y + engine.drawHeight * (1 - (this.screenPercentage + 0.5)),
    );
  }
}
