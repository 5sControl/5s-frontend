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

  const titleDate =
    setDateDot(new Date(data.orderDate).toLocaleDateString()) +
    ' | ' +
    new Date(data.orderDate).toLocaleTimeString();

  const dateInterval =
    setDateDot(new Date(data.orderTime).toLocaleDateString()) +
    ' - ' +
    setDateDot(new Date(data.orderDateRealize).toLocaleDateString());

  return (
    <Cover>
      {!isLoadingCurrentOrder ? (
        <div>
          <div className={styles.header}>
            <div className={styles.titleContent}>
              <h2 className={styles.title}>{`Order №${data.orderId}`}</h2>
              {data.orderStatus && <StatusLable status={data.orderStatus} />}
            </div>

            <p className={styles.orderDate}>{titleDate}</p>
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

          <div className={styles.line} />

          <div className={styles.list}>
            {data.product.map((product, index) => (
              <ProductCatd key={index} data={product} index={1} />
            ))}
          </div>
        </div>
      ) : null}
    </Cover>
  );
};
