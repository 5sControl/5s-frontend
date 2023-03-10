import { Modal } from '../../../../components/modal';
import styles from './operationVideoModal.module.scss';
import ReactPlayer from 'react-player';
import { getIsInternet, url } from '../../../../api/api';
import { useState } from 'react';
import { OperationItem, Product } from '../../../../storage/orderView';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  orderId?: string;
  productData?: Product;
  operationData?: OperationItem;
};

export const OperationVideoModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  orderId,
  productData,
  operationData,
}) => {
  const IPCamera = '192.168.1.160';
  const videoDate = '2023-03-10';
  const videoTime = '14-20';

  const [playerstate] = useState({
    playing: true,
    volume: 0.9,
    controls: true,
    width: '100%',
    height: '100%',
    url: getIsInternet(window.location.hostname)
      ? `${url}/images/${IPCamera}/${videoDate}/${videoTime}.mp4`
      : `http://${window.location.hostname}images/${IPCamera}/${videoDate}/${videoTime}.mp4`,
  });

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <ReactPlayer {...playerstate} />

      <div className={styles.infoBlock}>
        <p className={styles.operation}>{operationData?.operationName}</p>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.value}>{operationData?.operationTime}</span>
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
