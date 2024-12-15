import { Actor, Vector } from 'excalibur';

export class Ski extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Ski',
      pos,
    });
  }
}
