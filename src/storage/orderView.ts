export interface OrdersView {
  orders: Array<OrderItem>;
}

interface OrderItem {
  orderId: number;
  orderCustomer: string;
  orderDate: number;
  orderValid: number;
  orderTime: string;
  orderStatus: string;
  products: Array<Product>;
}

interface Product {
  productId: number;
  productName: string;
  operations: Array<OperationItem>;
}

interface OperationItem {
  operationId: number;
  operationName: string;
  operationTime: string;
  previewImage: string;
  operationVideo?: string;
}
