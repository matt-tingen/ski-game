import { Engine, ScreenElement, Text } from 'excalibur';
import { font } from './font';

export class RaceTimer extends ScreenElement {
  #ms = 0;
  private start: Date | undefined;
  private running = false;

  private text!: Text;
  private formatter!: Intl.NumberFormat;

  public get ms() {
    return this.#ms;
  }

  private recordTime() {
    const end = new Date();

    this.#ms += end.valueOf() - this.start!.valueOf();
    this.start = new Date();
  }

  private updateText() {
    this.text.text = this.formatter.format(this.ms / 1000);
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
    this.text = new Text({ text: '', font });
    this.formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.graphics.add(this.text);

    this.updateText();
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (this.running) {
      this.recordTime();
      this.updateText();
    }
  }
}
