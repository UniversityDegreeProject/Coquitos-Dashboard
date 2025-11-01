

export const formateDatetime = ( date : Date ) : string => {

  const dateFormatted = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return dateFormatted;

}