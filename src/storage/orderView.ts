export interface OrderItem {
  orderId: string;
  orderCustomer: string;
  orderDate: string;
  orderTime: string;
  orderDateRealize: string;
  orderStatus: string;
  product: ProductItem[];
}

export interface ProductItem {
  id: number;
  productDate: string;
  productDateRealize: string;
  productTime: string;
  productName: string;
  operationArticle: string;
  status: string;
  operations: Array<OperationItem>;
}

export interface PreviewOrderItem {
  id: number;
  orderId: string;
  orderStatus: string;
  orderDateRealize: string;
}

export interface OperationItem {
  operationId: number;
  operationName: string;
  operationTime: string;
  operationPosition: number;
  operationUse: number;
  operationWorker: string;
}
