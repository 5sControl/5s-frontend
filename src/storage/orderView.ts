export interface OrdersView {
  orders: Array<OrderItem>;
}

export interface OrderItem {
  orderId: number;
  orderCustomer: string;
  orderDate: number;
  orderValid: number;
  orderTime: string;
  orderStatus: string;
  products: Array<Product>;
}

export interface Product {
  productId: number;
  productName: string;
  articles: Array<ArticleItem>;
}

export interface ArticleItem {
  articlesId: number;
  articlesName: string;
  operations: Array<OperationItem>;
}

export interface OperationItem {
  operationId: number;
  operationName: string;
  operationTime: string;
  previewImage: string;
  operationVideo?: string;
}
