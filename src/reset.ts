import { Scene, SceneActivationContext } from 'excalibur';
import { MyLevel } from './level';

export class Reset extends Scene {
  onActivate({ engine }: SceneActivationContext<unknown>): void {
    engine.removeScene('game');
    engine.addScene('game', MyLevel);
    engine.goToScene('game');
  }
}
