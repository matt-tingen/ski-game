import {
  Color,
  DisplayMode,
  Engine,
  FadeInOut,
  ImageFiltering,
} from 'excalibur';
import { ControlledSound } from './ControlledSound';
import { MyLevel } from './level';
import { MainMenu } from './mainMenu';
import { Reset } from './reset';
import { loader, Resources } from './resources';

const game = new Engine({
  width: 600,
  height: 800,
  canvasElementId: 'game',
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  antialiasing: {
    filtering: ImageFiltering.Pixel,
  },
  scenes: {
    game: MyLevel,
    menu: MainMenu,
    reset: Reset,
  },
  configurePerformanceCanvas2DFallback: {
    allow: true,
    showPlayerMessage: true,
  },
});

game
  .start('game', {
    loader,
    inTransition: new FadeInOut({
      duration: 1000,
      direction: 'in',
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    Resources.SpaceSong.play();
  });

const muteBtn = document.getElementById('mute')!;

muteBtn.classList.toggle('muted', ControlledSound.muted);

muteBtn.addEventListener('click', () => {
  ControlledSound.muted = !ControlledSound.muted;
  muteBtn.classList.toggle('muted', ControlledSound.muted);
});
