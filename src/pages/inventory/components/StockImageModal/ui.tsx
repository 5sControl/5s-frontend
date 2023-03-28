/* eslint-disable quotes */
import { Modal } from '../../../../components/modal';
import styles from './stockImageModal.module.scss';
import moment from 'moment-timezone';
import { useAppSelector } from '../../../../store/hooks';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { setDateDot } from '../../../previewOrders/previewOrdersHelper';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  currentReport: any;
};

export const StockImageModal: React.FC<PropsType> = ({ isOpen, handleClose, currentReport }) => {
  const operationStart =
    currentReport.photos[0].date &&
    setDateDot(moment(currentReport.photos[0].date).subtract(10, 'days').calendar()) +
      ' | ' +
      moment(currentReport.photos[0].date).format('LT');

  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div
        className={styles.imageContainer}
        style={{
          backgroundImage: `url(${
            process.env.REACT_APP_ENV === 'proxy'
              ? `${process.env.REACT_APP_NGROK}${currentReport.photos[0].image}`
              : process.env.REACT_APP_ENV === 'wify'
              ? `${process.env.REACT_APP_IP_SERVER}${currentReport.photos[0].image}`
              : `http://${window.location.hostname}/${currentReport.photos[0].image}`
          })`,
        }}
      >
        <div className={styles.camera}>
          <p className={styles.text}>{activeInventoryItem?.camera}</p>
        </div>
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.operation}>{activeInventoryItem?.name}</p>
          <p
            className={`${styles.status} ${
              currentReport.extra[0].status === 'In stock' && styles.statusStock
            } ${currentReport.extra[0].status === 'Low stock level' && styles.statusLowStock} ${
              currentReport.extra[0].status === 'Out of stock' && styles.statusOutStock
            }`}
          >
            {currentReport.extra[0].status}
          </p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Stock level at the time : '}</span>
            <span className={styles.value}>{currentReport.extra[0].count}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Low stock level: '}</span>
            <span className={styles.value}> {currentReport.extra[0].low_stock_level}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Time: '}</span>
            <span className={styles.value}>{operationStart}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
