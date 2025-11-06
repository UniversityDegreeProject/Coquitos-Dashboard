export const formatDatetime = (datetime: Date | string ) => {

  if( typeof datetime === "string"){
    datetime = new Date(datetime)
  }

  return new Date(datetime).toLocaleDateString("es-ES",{
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};