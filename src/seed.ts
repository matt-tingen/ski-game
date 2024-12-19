import { searchParams } from './searchParams';

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const getSeed = () => searchParams.get('seed') || formatDate(new Date());
