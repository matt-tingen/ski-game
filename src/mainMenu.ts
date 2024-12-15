import { Color, Engine, GraphicsGroup, Rectangle, Scene, vec } from 'excalibur';
import { Button } from './Button';

export class MainMenu extends Scene {
  override onInitialize(engine: Engine): void {
    const playButton = new Button(
      () => {
        engine.goToScene('game');
      },
      {
        pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
      },
    );

    const rect = new Rectangle({
      width: 100,
      height: 25,
      color: Color.Green,
    });

    const group = new GraphicsGroup({
      members: [rect],
    });

    playButton.graphics.add(group);

    this.add(playButton);
  }
}
