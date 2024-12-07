import { DefaultMap } from '@matt-tingen/util';
import seedRandom from 'seed-random';

const dateString = new Date().toISOString().split('T')[0];

export const seed = (key: string) => seedRandom(`${dateString}:${key}`);
