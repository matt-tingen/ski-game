import { Actor, Vector } from 'excalibur';

export class Spawn extends Actor {
  constructor(pos: Vector) {
    super({ pos });
  }
}
