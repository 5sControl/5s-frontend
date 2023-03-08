import { OrderItem } from '../../../../storage/orderView';
import { ProductCatd } from '../ProductCatd';
import { StatusLable } from '../StatusLable';
import styles from './styles.module.scss';

type PropsType = {
  data: OrderItem;
};

export const OrderCard: React.FC<PropsType> = ({ data }) => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleContent}>
          <h2 className={styles.title}>{`Order №${data.orderId}`}</h2>
          <StatusLable type={data.orderStatus} />
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
        {data.products.map((productData, index) => (
          <ProductCatd key={productData.productId} index={++index} data={productData} />
        ))}
      </div>
    </div>
  );
};
