export const getTodayDateKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayRange = (
  dateKey?: string,
): { startDate: Date; endDate: Date } => {
  if (dateKey) {
    // Solo para satisfacer las dependencias de React hooks
  }
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

  return { startDate: startOfDay, endDate: endOfDay };
};
