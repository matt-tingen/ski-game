import { Color, DisplayMode, Engine, FadeInOut } from 'excalibur';
import { MyLevel } from './level';
import { MainMenu } from './mainMenu';
import { Reset } from './reset';
import { loader } from './resources';

const game = new Engine({
  width: 600,
  height: 800,
  canvasElementId: 'game',
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  scenes: {
    game: MyLevel,
    menu: MainMenu,
    reset: Reset,
  },
  suppressPlayButton: process.env.NODE_ENV === 'development',
});

game
  .start('game', {
    loader, // Optional loader (but needed for loading images/sounds)
    inTransition: new FadeInOut({
      // Optional in transition
      duration: 1000,
      direction: 'in',
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    // game.debug.collider.showAll = true;
    game.showDebug(true);
    // Do something after the game starts
  });
