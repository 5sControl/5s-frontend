import { OrderByCustomer, OrderSkan } from '../../storage/orderView';

export const parseOrdersData = (data: OrderByCustomer) => {
  const previewData = {
    id: data.indeks,
    orderDate: data.data,
    orderId: data.zlecenie,
    orderCustomer: data.klient,
    orderValid: 30,
    orderTime: data.datawejscia,
    orderStatus: getStatus(data.zakonczone, data.datawejscia),
    product: {
      productName: data.typ,
      operationArticle: data.orderName,
      operations: data.skans.map((element: OrderSkan) => {
        return {
          operationId: element.indeks,
          operationName: element.raport,
          operationTime: element.data,
        };
      }),
    },
  };

  return previewData;
};

export const getStatus = (zakonczone: number, datawejscia: string) => {
  if (zakonczone === 1) {
    return 'Completed';
  }

  if (zakonczone === 0 && datawejscia) {
    return 'Started';
  }
};
