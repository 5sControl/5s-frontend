import { Modal } from '../../../../components/modal';
import styles from './operationVideoModal.module.scss';
import ReactPlayer from 'react-player';
import { OperationItem, ProductItem } from '../../../../storage/orderView';
import { setDateDot } from '../../previewOrdersHelper';
import { VideoStateOperationModal } from './operationVideoModalSlice';
import moment from 'moment-timezone';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  orderId: string;
  productData?: ProductItem;
  operationData?: OperationItem;
  videoState: VideoStateOperationModal;
};

export const OperationVideoModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  orderId,
  productData,
  operationData,
  videoState,
}) => {
  const operationStart =
    operationData &&
    setDateDot(moment(operationData.operationTime).subtract(10, 'days').calendar()) +
      ' | ' +
      moment(operationData.operationTime).tz('Etc/GMT').format('LT');

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <ReactPlayer {...videoState} width="100%" height="100%" />

      <div className={styles.infoBlock}>
        <p className={styles.operation}>{operationData?.operationName}</p>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.value}>{operationStart}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Order: '}</span>
            <span className={styles.value}>{orderId}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Product: '}</span>
            <span className={styles.value}>{productData?.productName}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Frame: '}</span>
            <span className={styles.value}>{'Frame name'}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
