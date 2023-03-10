import React, { useEffect } from 'react';
import { Select } from '../../components/select/select';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import { OrderItem } from '../../storage/orderView';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveOrder } from './components/OrdersList/ordersListSlice';
import { Cover } from '../../components/cover';
import {
  defenitionAsync,
  selectPreviewOrders,
  setIsOpenOperationModal,
} from './previewOrdersSlice';
import { useCookies } from 'react-cookie';
import { OperationVideoModal } from './components/OperationVideoModal';

export const PreviewOrders: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const dispatch = useAppDispatch();
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const { isOpenOperationModal, orderdData } = useAppSelector(selectPreviewOrders);

  const listOfDate = [
    { id: 1, text: 'Last month, 2023 Jan 16 - Feb 16' },
    { id: 2, text: 'Last month, 2023 Feb 17 - Mar 16' },
    { id: 3, text: 'Last month, 2023 Mar 17 - Apr 16' },
    { id: 4, text: 'Last month, 2023 Apr 17 - May 16' },
  ];

  const listOfstatus = [
    { id: 1, text: 'Started' },
    { id: 2, text: 'Completed' },
  ];

  useEffect(() => {
    dispatch(defenitionAsync({ token: cookies.token, hostname: window.location.hostname }));
  }, []);

  const handleCloseModal = () => {
    dispatch(setIsOpenOperationModal(false));
  };

  const findActiveOrder = (id: number) => {
    if (orderdData) {
      return orderdData.find((item: OrderItem) => item.id === id);
    }

    return undefined;
  };

  return (
    <>
      <OperationVideoModal
        isOpen={isOpenOperationModal}
        handleClose={handleCloseModal}
        orderId={findActiveOrder(activeOrder as number)?.orderId}
        productData={findActiveOrder(activeOrder as number)?.product}
        operationData={findActiveOrder(activeOrder as number)?.product.operations[0]}
      />

      <WrapperPage>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Orders View</h2>

            <div className={styles.selectContainer}>
              <Select listOfData={listOfstatus} />
              <Select className={styles.listOfDate} listOfData={listOfDate} />
            </div>
          </div>

          {orderdData ? (
            <div className={styles.body}>
              <OrderList data={orderdData} />

              {activeOrder ? (
                <OrderCard data={findActiveOrder(activeOrder)} />
              ) : (
                <Cover className={styles.noOrder}>
                  <h4 className={styles.title}>No order</h4>
                  <p className={styles.subtitle}>Select an order from the list on the left</p>
                </Cover>
              )}
            </div>
          ) : null}
        </div>
      </WrapperPage>
    </>
  );
};
