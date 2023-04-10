import React, { useEffect, useState } from 'react';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addActiveOrder,
  FilterDataType,
  getFilterOperationsAsync,
  getOrdersAsync,
  resetAllFilterData,
  resetSelectFilterData,
  selectOrdersList,
  setFilterData,
  setIsShowOrdersViewFilter,
  setSearchValue,
} from './components/OrdersList/ordersListSlice';
import { Cover } from '../../components/cover';
import {
  selectPreviewOrders,
  getOrderAsync,
  setSelectOperationData,
  setSelectProductData,
} from './previewOrdersSlice';
import { useCookies } from 'react-cookie';
import { OperationVideoModal } from './components/OperationVideoModal';
import {
  selectOperationVideoModal,
  setIsOpenOperationVideoModal,
  setTimeOperationVideoModal,
} from './components/OperationVideoModal/operationVideoModalSlice';
import { Delete, Disconnect, Filter } from '../../assets/svg/SVGcomponent';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigateSearch } from '../../functions/useNavigateSearch';
import { OperationItem, OrderItem } from '../../storage/orderView';
import { Button } from '../../components/button';
import { FilterBar } from './components/FilterBar';

export const PreviewOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigateSearch = useNavigateSearch();
  const [cookies] = useCookies(['token']);
  const { orderData, selectOperationData, selectProductData } = useAppSelector(selectPreviewOrders);
  const {
    isShowOrdersViewFilter,
    filterData,
    isErrorOfOrdersList,
    isLoadingOrdersList,
    activeOrder,
    ordersList,
    search,
  } = useAppSelector(selectOrdersList);
  const { isOpenOperationVideoModal, videoState } = useAppSelector(selectOperationVideoModal);

  // const listOfDate = [
  //   { id: 1, text: 'Last month, 2023 Jan 16 - Feb 16' },
  //   { id: 2, text: 'Last month, 2023 Feb 17 - Mar 16' },
  //   { id: 3, text: 'Last month, 2023 Mar 17 - Apr 16' },
  //   { id: 4, text: 'Last month, 2023 Apr 17 - May 16' },
  // ];

  // const listOfstatus = [
  //   { id: 1, text: 'Started' },
  //   { id: 2, text: 'Completed' },
  // ];

  const handleCloseModal = () => {
    dispatch(setIsOpenOperationVideoModal(false));

    const queryParams = Object.fromEntries([...searchParams]);
    delete queryParams.operation_id;
    delete queryParams.product_id;
    navigateSearch('/orders-view', queryParams);
  };

  const handleSubmitClear = () => {
    dispatch(setSearchValue(null));
    getOrdersList(1, 50, null, filterData);
  };

  const getOrdersList = (
    page: number,
    page_size: number,
    search: string | null,
    params: FilterDataType
  ) => {
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page,
        page_size,
        search,
        params,
      })
    );
  };

  const handleClickFilter = (value: boolean) => {
    if (value) {
      dispatch(
        getFilterOperationsAsync({ token: cookies.token, hostname: window.location.hostname })
      );
    }
    dispatch(setIsShowOrdersViewFilter(value));
  };

  const handleSubmitFilters = (data: FilterDataType) => {
    getOrdersList(1, ordersList?.records_on_page as number, search, data);
    handleClickFilter(false);
  };

  const handleResetFilters = () => {
    dispatch(resetAllFilterData());
    getOrdersList(1, ordersList?.records_on_page as number, search, {
      'order-status': 'all',
      'operation-name': [],
      'operation-status': [],
    });

    const queryParams = Object.fromEntries([...searchParams]);
    delete queryParams['order-status'];
    delete queryParams['operation-status'];
    delete queryParams['operation-name'];
    navigateSearch('/orders-view', queryParams);

    handleClickFilter(false);
  };

  const handleHyperLink = (operationData: OperationItem) => {
    dispatch(setTimeOperationVideoModal(operationData));
  };
  const handleChangeSearch = (value: string) => {
    dispatch(setSearchValue(value));

    getOrdersList(
      ordersList?.current_page as number,
      ordersList?.records_on_page as number,
      value,
      filterData
    );
  };

  const [queryProps, setQueryProps] = useState<
    { name: string; value: string; onClick: () => void }[]
  >([]);

  useEffect(() => {
    const queryOrderStatusParam = searchParams.get('order-status');
    const queryOperationStatusParam = searchParams.getAll('operation-status');
    const queryOrderNameParam = searchParams.getAll('operation-name');

    const queryData: FilterDataType = {
      'order-status': queryOrderStatusParam as string,
      'operation-status': queryOperationStatusParam,
      'operation-name': queryOrderNameParam,
    };
    if (queryOrderStatusParam) {
      dispatch(setFilterData(queryData));
      getOrdersList(1, 50, null, queryData);
    } else {
      getOrdersList(1, 50, null, filterData);
    }

    return () => {
      dispatch(addActiveOrder(null));
    };
  }, []);

  const getFilterQueryData = () => {
    const queryOrderStatusParam = searchParams.get('order-status');
    const queryOperationStatusParam = searchParams.getAll('operation-status');
    const queryOrderNameParam = searchParams.getAll('operation-name');

    const queryData = {
      'order-status': queryOrderStatusParam as string,
      'operation-status': queryOperationStatusParam,
      'operation-name': queryOrderNameParam,
    };
    return queryData;
  };

  useEffect(() => {
    const queryData = getFilterQueryData();
    const operationNameLength = queryData['operation-name'].length;
    const orderStatus = queryData['order-status'];
    const operationStatus = queryData['operation-status'].length;

    const deletFilter = (param: string) => {
      const queryParams = Object.fromEntries([...searchParams]);
      delete queryParams[param];
      (queryData as any)[param] = [];
      navigateSearch('/orders-view', queryParams);
      dispatch(resetSelectFilterData(param));
      getOrdersList(
        ordersList?.current_page as number,
        ordersList?.records_on_page as number,
        search,
        queryData
      );
    };

    const newProps = [];
    if (operationNameLength > 0) {
      newProps.push({
        name: 'Operation:',
        value: operationNameLength.toString(),
        onClick: () => deletFilter('operation-name'),
      });
    }
    if (operationStatus > 0) {
      newProps.push({
        name: 'Operation status:',
        value: operationStatus.toString(),
        onClick: () => deletFilter('operation-status'),
      });
    }
    if (orderStatus) {
      newProps.push({
        name: 'Order status:',
        value: orderStatus,
        onClick: () => deletFilter('order-status'),
      });
    }

    setQueryProps(newProps);
  }, [searchParams]);

  useEffect(() => {
    const queryOrderIdParam = searchParams.get('order_id');
    const queryProductIdParam = searchParams.get('product_id');
    const queryOperationIdParam = searchParams.get('operation_id');

    if (!activeOrder && queryOrderIdParam !== null) {
      dispatch(addActiveOrder(queryOrderIdParam));
    }

    activeOrder &&
      dispatch(
        getOrderAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          currentOrder: activeOrder,
        })
      ).then((res) => {
        if (queryProductIdParam !== null && queryOperationIdParam !== null) {
          const productData = (res.payload as OrderItem).product.find((el) => {
            return el.id === +queryProductIdParam;
          });

          if (productData) {
            dispatch(setSelectProductData(productData));

            const operationData = productData.operations.find(
              (el) => el.operationId === +queryOperationIdParam
            );

            if (operationData) {
              dispatch(setSelectOperationData(operationData));
              dispatch(setTimeOperationVideoModal(operationData));
              dispatch(setIsOpenOperationVideoModal(true));
            }
          }
        }
      });
  }, [activeOrder]);

  return (
    <>
      {orderData && activeOrder && (
        <OperationVideoModal
          isOpen={isOpenOperationVideoModal}
          handleClose={handleCloseModal}
          handleHyperLink={handleHyperLink}
          orderId={orderData.orderId}
          productData={selectProductData}
          operationData={selectOperationData}
          videoState={videoState}
        />
      )}
      <FilterBar
        isOpen={isShowOrdersViewFilter}
        handleClose={() => handleClickFilter(false)}
        handleSubmit={handleSubmitFilters}
        handleResetFilters={handleResetFilters}
      />

      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.header_title}>Orders View</h2>

            <div className={styles.header_container}>
              {/* <Select listOfData={listOfstatus} />
              <Select className={styles.header_container_date} listOfData={listOfDate} /> */}
              <div className={styles.header_container_filters}>
                <Button
                  text="Filter"
                  IconLeft={Filter}
                  type="button"
                  variant="oval"
                  iconColor={
                    searchParams.get('order-status') ? 'var(--Orange)' : 'var(--HightEmphasis)'
                  }
                  onClick={() => handleClickFilter(true)}
                />

                {queryProps.map(({ name, value, onClick }, index) => (
                  <Button
                    key={index}
                    text={`${name} ${value}`}
                    IconRight={Delete}
                    type="button"
                    variant="oval"
                    iconColor={'var(--MediumEmphasis)'}
                    onClick={onClick}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.body}>
            <OrderList
              data={ordersList ? ordersList.results : []}
              isLoading={isLoadingOrdersList}
              showPaginations
              disabled={isErrorOfOrdersList}
              handleClearList={handleSubmitClear}
              handleChangeSearch={handleChangeSearch}
            />

            {activeOrder && orderData ? (
              <OrderCard data={orderData} />
            ) : (
              <Cover className={styles.body_error}>
                {isErrorOfOrdersList ? (
                  <div className={styles.error}>
                    <Disconnect className={styles.body_error_icon} />
                    <p className={styles.body_error_subtitle}>
                      To view your orders{' '}
                      <Link
                        to={'/configuration/database'}
                        className={styles.body_error_subtitle_link}
                      >
                        connect
                      </Link>{' '}
                      to the database with them in Configuration tab.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 className={styles.body_error_title}>No order</h4>
                    <p className={styles.body_error_subtitle}>
                      Select an order from the list on the left
                    </p>
                  </>
                )}
              </Cover>
            )}
          </div>
        </div>
      </WrapperPage>
    </>
  );
};
