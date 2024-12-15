import { Actor, vec, Vector } from 'excalibur';
import { SlolamFlag } from './SlolamFlag';
import { SlolamTrigger } from './SlolamTrigger';
import { zIndices } from './zIndices';

export class SlolamGate extends Actor {
  private leftFlag!: SlolamFlag;
  private rightFlag!: SlolamFlag;
  private trigger!: SlolamTrigger;

  constructor(
    pos: Vector,
    private gateWidth: number,
  ) {
    super({
      name: 'SlolamGate',
      pos,
      z: zIndices.pickup,
    });
  }

  override onInitialize() {
    const halfWidth = this.gateWidth / 2;

    this.addChild((this.leftFlag = new SlolamFlag('left', vec(-halfWidth, 0))));
    this.addChild(
      (this.rightFlag = new SlolamFlag('right', vec(halfWidth, 0))),
    );
    this.trigger = new SlolamTrigger(this.gateWidth);
    this.addChild(this.trigger);

    this.leftFlag.on('collisionstart', () => {
      this.trigger.kill();
    });
    this.rightFlag.on('collisionstart', () => {
      this.trigger.kill();
    });
  }
}
