


export const getClientTypeColor = (type: string) => {
  switch (type) {
    case 'Regular':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    case 'VIP':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-200';
    case 'Ocasional':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200';
  }
};