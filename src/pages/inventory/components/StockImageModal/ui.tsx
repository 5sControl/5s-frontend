/* eslint-disable quotes */
import { Modal } from '../../../../components/modal';
import styles from './stockImageModal.module.scss';
import moment from 'moment-timezone';
import { getIsInternet, url } from '../../../../api/api';
import { useAppSelector } from '../../../../store/hooks';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { setDateDot } from '../../../previewOrders/previewOrdersHelper';
import { parseExtraFuild } from '../../inventoryHelper';

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
      moment(currentReport.photos[0].date).tz('Etc/GMT').format('LT');

  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <img
        className={styles.image}
        src={
          getIsInternet(window.location.hostname)
            ? `${url}${currentReport.photos[0].image}`
            : `http://${window.location.hostname}/${currentReport.photos[0].image}`
        }
        alt="image"
      />

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.operation}>{activeInventoryItem?.name}</p>
          <p
            className={`${styles.status} ${
              parseExtraFuild(currentReport.extra).status === 'In stock' && styles.statusStock
            } ${
              parseExtraFuild(currentReport.extra).status === 'Low stock level' &&
              styles.statusLowStock
            } ${
              parseExtraFuild(currentReport.extra).status === 'Out of stock' &&
              styles.statusOutStock
            }`}
          >
            {parseExtraFuild(currentReport.extra).status}
          </p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Stock level at the time : '}</span>
            <span className={styles.value}>{parseExtraFuild(currentReport.extra).count}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Low stock level: '}</span>
            <span className={styles.value}>
              {' '}
              {parseExtraFuild(currentReport.extra).low_stock_level}
            </span>
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
