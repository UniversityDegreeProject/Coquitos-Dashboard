


export const getClientTypeColor = (type: string) => {
  switch (type) {
    case 'Regular':
      return 'bg-blue-100 text-blue-800';
    case 'VIP':
      return 'bg-green-100 text-green-800';
    case 'Ocasional':
      return 'bg-red-100 text-red-800';
  }
};