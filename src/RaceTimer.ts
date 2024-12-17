import { Actor, Engine } from 'excalibur';

export class RaceTimer extends Actor {
  #ms = 0;

  public running = false;
  private formatter!: Intl.NumberFormat;

  constructor(private element: HTMLElement) {
    super();
  }

  public get ms() {
    return this.#ms;
  }

  private updateText() {
    this.element.textContent = `${this.formatter.format(this.ms / 1000)}s`;
  }

  override onInitialize(engine: Engine): void {
    this.formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.updateText();
  }

  override update(engine: Engine, elapsedMs: number): void {
    if (this.running) {
      this.#ms += elapsedMs;
      this.updateText();
    }
  }
}
