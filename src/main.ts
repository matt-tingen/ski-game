import {
  Color,
  DisplayMode,
  Engine,
  FadeInOut,
  ImageFiltering,
} from 'excalibur';
import { MyLevel } from './level';
import { MainMenu } from './mainMenu';
import { Reset } from './reset';
import { loader, Resources } from './resources';
import { initVolume } from './volume';

const game = new Engine({
  width: 500,
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
    Resources.SpaceSong.instanceVolume = 0.7;
    Resources.SpaceSong.play();
  });

initVolume();
