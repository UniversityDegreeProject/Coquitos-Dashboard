export const useQuerys = {
  allProducts: ['products', 'all'],
  productById: (id: string) => ['products', 'by-id', id],
  searchProducts: (search?: string, categoryId?: string, status?: string) => 
    ['products', 'search', { search, categoryId, status }],
};

