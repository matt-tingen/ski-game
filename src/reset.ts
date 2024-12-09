import {
  Color,
  Engine,
  GraphicsGroup,
  Rectangle,
  Scene,
  SceneActivationContext,
  Text,
  vec,
} from 'excalibur';
import { Button } from './Button';
import { font } from './font';
import { MyLevel } from './level';

export class Reset extends Scene {
  onActivate({ engine }: SceneActivationContext<unknown>): void {
    engine.removeScene('game');
    engine.addScene('game', MyLevel);
    engine.goToScene('game');
  }
}
