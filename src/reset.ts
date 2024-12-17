import { Scene, SceneActivationContext } from 'excalibur';
import { BackgroundColor } from './bg';
import { MyLevel } from './level';

export class Reset extends Scene {
  backgroundColor = BackgroundColor;

  // eslint-disable-next-line class-methods-use-this
  onActivate({ engine }: SceneActivationContext<unknown>): void {
    engine.removeScene('game');
    engine.addScene('game', MyLevel);
    engine.goToScene('game');
  }
}
