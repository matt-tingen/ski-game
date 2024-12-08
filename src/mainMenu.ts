import {
  Color,
  Engine,
  GraphicsGroup,
  Rectangle,
  Scene,
  Text,
  vec,
} from 'excalibur';
import { Button } from './Button';
import { font } from './font';

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
    const label = new Text({
      text: 'play',
      color: Color.Black,
      font,
    });

    const group = new GraphicsGroup({
      members: [rect, label],
    });

    playButton.graphics.add(group);

    this.add(playButton);
  }
}
