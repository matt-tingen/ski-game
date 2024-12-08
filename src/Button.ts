import {
  Actor,
  Color,
  Engine,
  GraphicsGroup,
  Rectangle,
  Text,
  Vector,
} from 'excalibur';
import { font } from './font';

interface ButtonConfig {
  text: string;
  onClick: () => void;
  size: Vector;
  background: Color;
  foreground: Color;
}

export class Button extends Actor {
  private isDown = false;
  constructor(private config: ButtonConfig) {
    super();
  }

  onInitialize(engine: Engine): void {
    this.on('pointerdown', () => {
      this.isDown = true;
    });
    this.on('pointerup', () => {
      if (this.isDown) this.config.onClick();
      this.isDown = false;
    });
    this.on('pointerleave', () => {
      this.isDown = false;
    });

    const rect = new Rectangle({
      width: this.config.size.x,
      height: this.config.size.y,
      color: this.config.background,
    });
    const label = new Text({
      text: this.config.text,
      color: this.config.foreground,
      font,
    });

    const group = new GraphicsGroup({
      members: [rect, label],
    });

    this.graphics.add(group);
  }
}
