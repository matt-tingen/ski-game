const formatDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const getSeed = () =>
  new URL(location.toString()).searchParams.get('seed') ||
  formatDate(new Date());
