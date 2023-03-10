export interface OrdersView {
  orders: Array<OrderItem>;
}
export interface OrderItem {
  id: number;
  orderId: string;
  orderCustomer: string;
  orderDate: number;
  orderValid: number;
  orderTime: string;
  orderStatus: string;
  product: Product;
}

export interface Product {
  productName: string;
  operationArticle: string;
  operations: Array<OperationItem>;
}

export interface ArticleItem {
  articlesName: string;
  operations: Array<OperationItem>;
}

export interface OperationItem {
  operationId: number;
  operationName: string;
  operationTime: string;
}
