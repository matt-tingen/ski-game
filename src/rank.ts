import { orderBy, unzip } from 'es-toolkit';

export type Iterator<T> = (item: T) => number | string;
export type Dir = 'asc' | 'desc';
export type Sort<T> = [iterator: Iterator<T>, direction: Dir];

const unzipSorts = <T>(sorts: Sort<T>[]) =>
  unzip(sorts) as [Iterator<T>[], Dir[]];

export const rank = <T extends object, U>(
  collection: T[],
  rankingSorts: Sort<T>[],
  tieBreakerSorts: Sort<T>[],
  ranker: (item: T, rank: number) => U,
): U[] => {
  const [rankingIterators, rankingOrders] = unzipSorts(rankingSorts);
  const [tieBreakerIterators, tieBreakerOrders] = unzipSorts(tieBreakerSorts);
  const sortIterators = [...rankingIterators, ...tieBreakerIterators];
  const sortOrders = [...rankingOrders, ...tieBreakerOrders];

  const sorted = orderBy(collection, sortIterators, sortOrders);

  const ranks = sorted.reduce<number[]>((acc, item, i) => {
    const prevIndex = i - 1;
    const prevItem = sorted[prevIndex];
    const tied =
      prevItem &&
      rankingIterators.every(
        (iterator) => iterator(item) === iterator(prevItem),
      );

    acc.push(tied ? acc[prevIndex] : i + 1);

    return acc;
  }, []);

  return sorted.map((item, i) => ranker(item, ranks[i]));
};
