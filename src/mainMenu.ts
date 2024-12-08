import { Color, Engine, Scene, vec } from 'excalibur';
import { Button } from './Button';

export class MainMenu extends Scene {
  override onInitialize(engine: Engine): void {
    const playButton = new Button({
      text: 'Play',
      size: vec(100, 25),
      background: Color.Green,
      foreground: Color.Black,
      onClick: () => {
        engine.goToScene('game');
      },
    });

    playButton.pos = vec(engine.halfDrawWidth, engine.halfDrawHeight);

    this.add(playButton);
  }
}
