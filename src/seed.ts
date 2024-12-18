import { searchParams } from './searchParams';

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const getSeed = () => searchParams.get('seed') || formatDate(new Date());
