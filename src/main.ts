import { once } from 'es-toolkit';
import { Color, DisplayMode, Engine, ImageFiltering } from 'excalibur';
import { leftTurnButton, rightTurnButton } from './elements';
import { MyLevel } from './level';
import { MainMenu } from './mainMenu';
import { Reset } from './reset';
import { loader, Resources } from './resources';
import { initVolume } from './volume';

const startMusic = once(() => {
  Resources.ArcadeSong.instanceVolume = 0.6;
  Resources.ArcadeSong.loop = true;
  Resources.ArcadeSong.play();
});

const requestMusic = () => {
  if (!navigator.userActivation || navigator.userActivation.hasBeenActive) {
    startMusic();
  }
};

const game = new Engine({
  width: 300,
  height: 800,
  canvasElementId: 'game',
  backgroundColor: Color.Transparent,
  displayMode: DisplayMode.FitContainer,
  pixelArt: true,
  antialiasing: {
    filtering: ImageFiltering.Pixel,
  },
  scenes: {
    game: MyLevel,
    menu: MainMenu,
    reset: Reset,
  },
  suppressPlayButton: true,
  suppressHiDPIScaling: true,
  configurePerformanceCanvas2DFallback: {
    allow: true,
    showPlayerMessage: true,
  },
});

game
  .start('menu', {
    loader,
  })
  .then(() => {
    requestMusic();
  });

initVolume();

// https://developer.mozilla.org/en-US/docs/Web/Security/User_activation
['keydown', 'mousedown', 'pointerdown', 'pointerup', 'touchend'].forEach(
  (e) => {
    document.addEventListener(e, requestMusic);
  },
);

[leftTurnButton, rightTurnButton].forEach((btn) => {
  const onButtonDown = () => {
    btn.setAttribute('data-active', 'true');
  };

  const onButtonUp = () => {
    btn.removeAttribute('data-active');
  };

  btn.addEventListener('pointerdown', onButtonDown);
  btn.addEventListener('pointerup', onButtonUp);
  btn.addEventListener('pointercancel', onButtonUp);
});
