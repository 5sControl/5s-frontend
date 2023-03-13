export interface OrdersView {
  orders: Array<OrderItem>;
}

export interface OrderByCustomer {
  indeks: number;
  data: string;
  zlecenie: string;
  klient: string;
  datawejscia: string;
  zakonczone: number;
  typ: string;
  orderName: string;
  skans: OrderSkan[];
}

export interface OrderSkan {
  indeks: number;
  data: string;
  stanowisko: number;
  raport: string;
}

export interface OrderItem {
  id: number;
  orderId: string;
  orderCustomer: string;
  orderDate: string;
  orderValid: number;
  orderTime: string;
  orderStatus?: string;
  product: Product;
}

export interface Product {
  productName: string;
  operationArticle: string;
  operations: Array<OperationItem>;
}

export interface PreviewOrderItem {
  orderId: string;
  orderStatus: string;
  id: number;
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
