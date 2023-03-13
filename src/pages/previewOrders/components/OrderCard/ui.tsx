import { Cover } from '../../../../components/cover';
import { OrderItem } from '../../../../storage/orderView';
import { useAppSelector } from '../../../../store/hooks';
import { selectPreviewOrders } from '../../previewOrdersSlice';
import { ProductCatd } from '../ProductCatd';
import { StatusLable } from '../StatusLable';
import styles from './orderCard.module.scss';

type PropsType = {
  data: OrderItem;
};

export const OrderCard: React.FC<PropsType> = ({ data }) => {
  const { isLoadingCurrentOrder } = useAppSelector(selectPreviewOrders);

  return (
    <Cover>
      {!isLoadingCurrentOrder ? (
        <div>
          <div className={styles.header}>
            <div className={styles.titleContent}>
              <h2 className={styles.title}>{`Order №${data.orderId}`}</h2>
              {data.orderStatus && <StatusLable type={data.orderStatus} />}
            </div>

            <p className={styles.orderTime}>{data.orderTime}</p>
          </div>

          <div>
            <div className={styles.subtitle}>
              <span>{'Customer: '}</span>
              <span className={styles.customer}>{data.orderCustomer}</span>
            </div>

            <div className={styles.subtitle}>
              <span>{'Offer date: '}</span>
              <span>{new Date(data.orderDate).toLocaleDateString()}</span>
            </div>

            <div className={styles.subtitle}>
              <span>{'Offer valid of '}</span>
              <span>{data.orderValid}</span>
              <span>{' days'}</span>
            </div>
          </div>

          <div className={styles.line} />

          <div className={styles.list}>
            <ProductCatd data={data.product} index={1} />
          </div>
        </div>
      ) : null}
    </Cover>
  );
};
