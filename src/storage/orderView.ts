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

export interface ArticleItem {
  [key: string]: OperationItem[];
}

export interface PreviewOrderItem {
  id: number;
  orderId: string;
  orderStatus: string;
  orderDateRealize: string;
}

export type VideoDataStatus = {
  status: boolean;
  date_start: number;
  date_end: number;
  file_name: string;
  camera_ip: string;
};

export interface OperationItem {
  operationId: number;
  operationName: string;
  operationTime: string;
  operationPosition: number;
  operationUse: number;
  operationWorker: string;
  status: boolean | null;
  video_data: VideoDataStatus;
}

export interface OrdersWithPagination {
  current_page: number;
  all_page_count: number;
  count: number;
  next: string | null;
  previous: string | null;
  records_on_page: number;
  results: PreviewOrderItem[];
}
