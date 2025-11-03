

export const formateDatetime = (datetime: Date) => {
  return new Date(datetime).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}