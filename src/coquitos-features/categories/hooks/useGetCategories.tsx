import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { categoriesQueries } from "../const";
import { getCategories } from "../services/category.service";
import type {
  SearchCategoriesParams,
  GetCategoriesResponse,
} from "../interfaces";

const defaultResponse: GetCategoriesResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  nextPage: null,
  previousPage: null,
};

export const useGetCategories = (params: SearchCategoriesParams) => {
  const useQueryCategories = useQuery<GetCategoriesResponse>({
    queryKey: categoriesQueries.categoryWithFilters(params),
    queryFn: (): Promise<GetCategoriesResponse> => getCategories(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  const {
    data: categories,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
  } = useQueryCategories.data || defaultResponse;

  return {
    ...useQueryCategories,
    categories,
    total,
    page,
    limit,
    totalPages,
    nextPage,
    previousPage,
  };
};
