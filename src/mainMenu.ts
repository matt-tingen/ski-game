import { Engine, Scene } from 'excalibur';
import { BackgroundColor } from './bg';

export class MainMenu extends Scene {
  backgroundColor = BackgroundColor;

  // eslint-disable-next-line class-methods-use-this
  override onInitialize(engine: Engine): void {
    document.getElementById('play')!.addEventListener('click', () => {
      engine.goToScene('game');
    });
  }

  // eslint-disable-next-line class-methods-use-this
  override onActivate(): void {
    document.getElementById('tutorial')!.classList.remove('hidden');
  }

  // eslint-disable-next-line class-methods-use-this
  override onDeactivate(): void {
    document.getElementById('tutorial')!.classList.add('hidden');
  }
}
