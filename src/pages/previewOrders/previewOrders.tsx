import React, { useEffect } from 'react';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getOrdersAsync,
  selectOrdersList,
  setSearchValue,
} from './components/OrdersList/ordersListSlice';
import { Cover } from '../../components/cover';
import { selectPreviewOrders, getOrderAsync } from './previewOrdersSlice';
import { useCookies } from 'react-cookie';
import { OperationVideoModal } from './components/OperationVideoModal';
import {
  selectOperationVideoModal,
  setIsOpenOperationVideoModal,
} from './components/OperationVideoModal/operationVideoModalSlice';
import { Disconnect } from '../../assets/svg/SVGcomponent';
import { Link } from 'react-router-dom';

export const PreviewOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const { orderData, selectOperationData, selectProductData } = useAppSelector(selectPreviewOrders);
  const { isErrorOfOrdersList, isLoadingOrdersList, activeOrder, ordersList } =
    useAppSelector(selectOrdersList);
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
  };

  const handleSubmitSearch = (value: string) => {
    dispatch(setSearchValue(value));
    getOrdersList(ordersList?.current_page as number, ordersList?.records_on_page as number, value);
  };

  const handleSubmitClear = () => {
    dispatch(setSearchValue(null));
    getOrdersList(1, 50, null);
  };

  const getOrdersList = (page: number, page_size: number, search: string | null) => {
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page,
        page_size,
        search,
      })
    );
  };

  useEffect(() => {
    getOrdersList(1, 50, null);
  }, []);

  useEffect(() => {
    activeOrder &&
      dispatch(
        getOrderAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          currentOrder: activeOrder,
        })
      );
  }, [activeOrder]);

  return (
    <>
      {orderData && activeOrder && (
        <OperationVideoModal
          isOpen={isOpenOperationVideoModal}
          handleClose={handleCloseModal}
          orderId={orderData.orderId}
          productData={selectProductData}
          operationData={selectOperationData}
          videoState={videoState}
        />
      )}

      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Orders View</h2>

            {/* <div className={styles.selectContainer}>
            <Select listOfData={listOfstatus} />
            <Select className={styles.listOfDate} listOfData={listOfDate} />
          </div> */}
          </div>

          <div className={styles.body}>
            <OrderList
              data={ordersList ? ordersList.results : []}
              isLoading={isLoadingOrdersList}
              showPaginations
              disabled={isErrorOfOrdersList}
              handleSubmitSearch={handleSubmitSearch}
              handleClearList={handleSubmitClear}
            />

            {activeOrder && orderData ? (
              <OrderCard data={orderData} />
            ) : (
              <Cover className={styles.noOrder}>
                {isErrorOfOrdersList ? (
                  <div className={styles.errorConnection}>
                    <Disconnect className={styles.errorConnection_icon} />
                    <p className={styles.errorConnection_desc}>
                      To view your orders{' '}
                      <Link
                        to={'/configuration/database'}
                        className={styles.errorConnection_desc_link}
                      >
                        connect
                      </Link>{' '}
                      to the database with them in Configuration tab.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 className={styles.title}>No order</h4>
                    <p className={styles.subtitle}>Select an order from the list on the left</p>
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
