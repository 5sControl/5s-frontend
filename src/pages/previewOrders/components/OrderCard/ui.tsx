import { Cover } from '../../../../components/cover';
import { OrderItem } from '../../../../storage/orderView';
import { useAppSelector } from '../../../../store/hooks';
import { setDateDot } from '../../previewOrdersHelper';
import { selectPreviewOrders } from '../../previewOrdersSlice';
import { ProductCatd } from '../ProductCatd';
import { StatusLable } from '../StatusLable';
import styles from './orderCard.module.scss';

type PropsType = {
  data: OrderItem;
};

export const OrderCard: React.FC<PropsType> = ({ data }) => {
  const { isLoadingCurrentOrder } = useAppSelector(selectPreviewOrders);

  const dateInterval =
    setDateDot(new Date(data.orderTime).toLocaleDateString()) +
    ' - ' +
    (data.orderDateRealize
      ? setDateDot(new Date(data.orderDateRealize).toLocaleDateString())
      : 'processed');

  return (
    <Cover className={styles.cover}>
      {!isLoadingCurrentOrder ? (
        <>
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <div className={styles.titleContent}>
                <h2 className={styles.title}>{`Order #${data.orderId}`}</h2>
                {data.orderStatus && (
                  <StatusLable
                    title={data.orderStatus}
                    status={
                      data.orderStatus === 'Completed'
                        ? 'completed'
                        : data.orderStatus === 'Started'
                        ? 'error'
                        : 'undefined'
                    }
                  />
                )}
              </div>

              {/* Hide date on design */}
              {/* <p className={styles.orderDate}>{titleDate}</p> */}
            </div>

            <div>
              <div className={styles.subtitle}>
                <span>{'Customer: '}</span>
                <span className={styles.customer}>{data.orderCustomer}</span>
              </div>

              <div className={styles.subtitle}>
                <span>{'Date: '}</span>
                <span>{dateInterval}</span>
              </div>
            </div>
          </div>

          <div className={styles.list}>
            {data.product.map((product, index) => (
              <ProductCatd key={index} data={product} index={++index} />
            ))}
          </div>
        </>
      ) : null}
    </Cover>
  );
};
