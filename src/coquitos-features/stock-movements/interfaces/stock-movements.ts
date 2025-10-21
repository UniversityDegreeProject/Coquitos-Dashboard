export type StockMovementType = "Reabastecimiento" | "Compra" | "Venta" | "Ajuste" | "Devolucion" | "Dañado";

export interface StockMovementResponse {
  id? : string;
  productId : string;
  userId : string;
  type : StockMovementType;
  quantity : number;
  previousStock : number;
  newStock : number;
  reason : string;
  reference : string;
  notes : string | null;
  createdAt : Date;
}


export interface GetStockMovementsResponse {
  stockMovements : StockMovementResponse[];
}

export interface SearchStockMovementsResponse {
  stockMovements : StockMovementResponse[];
}

export interface SearchStockMovementsParams {
  search?: string;
}

export interface StockMovementMutationResponse {
  stockMovement : StockMovementResponse;
}

export interface StockMovementFormData {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  reference: string;
  notes?: string;
}