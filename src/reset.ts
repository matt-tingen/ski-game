import { Scene, SceneActivationContext } from 'excalibur';
import { MyLevel } from './level';

export class Reset extends Scene {
  // eslint-disable-next-line class-methods-use-this
  onActivate({ engine }: SceneActivationContext<unknown>): void {
    engine.removeScene('game');
    engine.addScene('game', MyLevel);
    engine.goToScene('game');
  }
}
