import { OrderItem, ProductItem } from '../../storage/orderView';
import { OrderRequest, OrderSkan } from '../../storage/orderViewCustomer';

export const parseOrdersData = (data: OrderRequest): OrderItem => {
  const previewData = {
    orderId: data.zlecenie,
    orderDate: data.data,
    orderCustomer: data.klient,
    orderTime: data.datawejscia,
    orderStatus: data.status,
    orderDateRealize: data.datazakonczenia,
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
                    operationTime: element.date,
                    operationId: element.indeks,
                    operationName: element.raport,
                    operationPosition: element.stanowisko,
                    operationUse: element.uzytkownik,
                    operationWorker: element.worker,
                    status: element.status,
                    video_data: element.video_data,
                  };
                })
              : [],
          };
        })
      : [],
  };

  return previewData;
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
