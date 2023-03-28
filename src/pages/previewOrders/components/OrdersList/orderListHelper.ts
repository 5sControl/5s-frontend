import { PreviewOrderItem } from '../../../../storage/orderView';
import { OrderListByCustomer } from '../../../../storage/orderViewCustomer';

export const parseOrderData = (data: OrderListByCustomer) => {
  const previewData: PreviewOrderItem = {
    id: data.indeks,
    orderId: data.zlecenie,
    orderStatus: data.status,
    orderDateRealize: data.terminrealizacji,
  };

  return previewData;
};
