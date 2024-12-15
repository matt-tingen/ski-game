import { Actor, Engine, Text } from 'excalibur';

export class RaceTimer extends Actor {
  #ms = 0;
  private start: Date | undefined;
  private running = false;

  private text!: Text;
  private formatter!: Intl.NumberFormat;

  constructor(private element: HTMLElement) {
    super();
  }

  public get ms() {
    return this.#ms;
  }

  private recordTime() {
    const end = new Date();

    this.#ms += end.valueOf() - this.start!.valueOf();
    this.start = new Date();
  }

  private updateText() {
    this.element.textContent = `${this.formatter.format(this.ms / 1000)}s`;
  }

  public pause() {
    this.recordTime();
    this.running = false;
  }

  public resume() {
    this.start = new Date();
    this.running = true;
  }

  override onInitialize(engine: Engine): void {
    this.formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.updateText();
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (this.running) {
      this.recordTime();
      this.updateText();
    }
  }
}
