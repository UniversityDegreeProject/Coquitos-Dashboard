import type { Product } from "../interfaces";


export const backendProductToFrontendProduct = (backendProduct: Product): Product => {
  return {
    ...backendProduct,
  };
};