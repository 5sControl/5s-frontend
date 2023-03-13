import {
  OrderByCustomer,
  OrderItem,
  OrderListByCustomer,
  OrderSkan,
  PreviewOrderItem,
} from '../../storage/orderView';

export const parseOrdersData = (data: OrderByCustomer): OrderItem => {
  const previewData = {
    id: data.indeks,
    orderDate: data.data,
    orderId: data.zlecenie,
    orderCustomer: data.klient,
    orderValid: 30,
    orderTime: data.datawejscia,
    orderStatus: getStatus(data.zakonczone, data.datawejscia),
    orderDateRealize: data.terminrealizacji,
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

export const parseOrderData = (data: OrderListByCustomer) => {
  const previewData: PreviewOrderItem = {
    id: data.indeks,
    orderId: data.zlecenie,
    orderStatus: data.status,
    orderDateRealize: data.terminrealizacji,
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

  return '';
};

export const getDateDiff = (date: string) => {
  const now = new Date();
  const datefromAPITimeStamp = new Date(date).getTime();
  const nowTimeStamp = now.getTime();
  const microSecondsDiff = Math.abs(datefromAPITimeStamp - nowTimeStamp);
  const daysDiff = Math.round(microSecondsDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export const setDateDot = (formatDate: string) => {
  return formatDate.split('/').join('.');
};
