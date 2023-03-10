export const parseOrdersData = (data: any) => {
  const previewData = data.map((item: any) => {
    return {
      id: item.indeks,
      orderDate: item.data,
      orderId: item.zlecenie.replace(/\s/g, ''),
      orderCustomer: item.klient,
      orderValid: 30,
      orderTime: item.datawejscia,
      orderStatus: getStatus(item.zakonczone, item.datawejscia),
      product: {
        productName: item.typ,
        operationArticle: item.orderName,
        operations: item.skans.map((element: any) => {
          return {
            operationId: element.indeks,
            operationName: element.raport,
            operationTime: element.data,
          };
        }),
      },
    };
  });

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
