import { Color, DisplayMode, Engine, FadeInOut } from 'excalibur';
import { MyLevel } from './level';
import { loader } from './resources';

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 600,
  height: 800,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: MyLevel,
  },
  suppressPlayButton: process.env.NODE_ENV === 'development',
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game
  .start('start', {
    // name of the start scene 'start'
    loader, // Optional loader (but needed for loading images/sounds)
    inTransition: new FadeInOut({
      // Optional in transition
      duration: 1000,
      direction: 'in',
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    // Do something after the game starts
  });
