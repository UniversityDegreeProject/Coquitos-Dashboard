export const getStartOfDay = (date: Date): Date => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();

  return new Date(year, month, day);
};
