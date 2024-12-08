import { ActorArgs, ScreenElement } from 'excalibur';

export class Button extends ScreenElement {
  public isDown = false;

  constructor(
    private onClick: () => void,
    args?: ActorArgs,
  ) {
    super(args);
  }

  onInitialize(): void {
    this.on('pointerdown', () => {
      this.isDown = true;
    });
    this.on('pointerup', () => {
      if (this.isDown) this.onClick();
      this.isDown = false;
    });
    this.on('pointerleave', () => {
      this.isDown = false;
    });
  }
}
