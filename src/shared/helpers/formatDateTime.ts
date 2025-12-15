export const formatDateTime = (date: Date | string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
