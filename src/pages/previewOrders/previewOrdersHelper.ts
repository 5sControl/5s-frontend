import { OrderItem, PreviewOrderItem, ProductItem } from '../../storage/orderView';
import { OrderListByCustomer, OrderRequest, OrderSkan } from '../../storage/orderViewCustomer';

export const parseOrdersData = (data: OrderRequest): OrderItem => {
  const previewData = {
    orderId: data.products[0].zlecenie,
    orderDate: data.data,
    orderCustomer: data.klient,
    orderTime: data.datawejscia,
    orderStatus: data.status,
    orderDateRealize: data.terminrealizacji,
    product: data.products
      ? data.products.map((product) => {
          return {
            id: product.indeks,
            productDate: product.data,
            productDateRealize: product.terminrealizacji,
            productTime: product.datawejscia,
            productName: product.typ,
            operationArticle: product.orderName,
            status: product.status,
            operations: product.skans
              ? product.skans.map((element: OrderSkan) => {
                  return {
                    operationTime: element.data,
                    operationId: element.indeks,
                    operationName: element.raport,
                    operationPosition: element.stanowisko,
                    operationUse: element.uzytkownik,
                    operationWorker: element.worker,
                  };
                })
              : [],
          };
        })
      : [],
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

export const sortOperations = (productData: ProductItem) =>
  productData.operations.reduce((prev, curr, index, arr) => {
    const dateToString = (date: string) => new Date(date).toLocaleDateString().split('/').join('.');

    const filter = arr.filter(
      (el) => dateToString(el.operationTime) === dateToString(curr.operationTime)
    );

    return {
      ...prev,
      [dateToString(curr.operationTime)]: filter,
    };
  }, {});
