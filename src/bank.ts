import { Actor, Vector } from 'excalibur';
import { Resources } from './resources';

export class Bank extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Bank',
      pos,
      width: 16,
      height: 16,
    });
  }

  override onInitialize() {
    const img =
      Math.random() < 0.1 ? Resources.BankDetail : Resources.BankPlain;

    this.graphics.add(img.toSprite());
  }
}
