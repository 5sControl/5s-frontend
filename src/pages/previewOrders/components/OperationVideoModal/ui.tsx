import { Modal } from '../../../../components/modal';
import styles from './operationVideoModal.module.scss';
import ReactPlayer from 'react-player';
import { OperationItem, ProductItem } from '../../../../storage/orderView';
import { setDateDot } from '../../previewOrdersHelper';
import { VideoStateOperationModal } from './operationVideoModalSlice';
import moment from 'moment-timezone';
import { StatusLable } from '../StatusLable';
import {
  CheckCircleOutline,
  Download,
  ExclamationPointCircle,
  QuestionCircle,
} from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  handleHyperLink: (data: OperationItem) => void;
  orderId: string;
  productData?: ProductItem;
  operationData?: OperationItem;
  videoState: VideoStateOperationModal;
};

export const OperationVideoModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  handleHyperLink,
  orderId,
  productData,
  operationData,
  videoState,
}) => {
  const selectIcon = (): {
    status: 'error' | 'undefined' | 'completed';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
  } => {
    if (operationData?.status === null) {
      return { status: 'undefined', icon: QuestionCircle, title: 'No data' };
    } else if (operationData?.status) {
      return { status: 'error', icon: ExclamationPointCircle, title: 'Violation' };
    } else {
      return { status: 'completed', icon: CheckCircleOutline, title: 'Compliance' };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={styles.modal}
      showCross
      showSubstrateCross
    >
      <ReactPlayer {...videoState} width="100%" height="100%" />

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.header_title}>{operationData?.operationName}</p>
          <StatusLable
            title={selectIcon().title}
            status={selectIcon().status}
            IconLeft={selectIcon().icon}
          />
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.subtitle_value}>
              {operationData &&
                setDateDot(new Date(operationData.operationTime).toLocaleDateString())}
            </span>
            <span className={styles.subtitle_value}>{' | '}</span>
            <span
              className={styles.subtitle_value_clipboard}
              onClick={() => operationData && handleHyperLink(operationData)}
            >
              {operationData && moment(operationData.operationTime).tz('Etc/GMT').format('LT')}
            </span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Order: '}</span>
            <span className={styles.subtitle_value}>{orderId}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Product: '}</span>
            <span className={styles.subtitle_value}>{productData?.productName}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Frame: '}</span>
            <span className={styles.subtitle_value}>{'Frame name'}</span>
          </div>
        </div>
      </div>

      <Button
        href={operationData?.video_data.file_name}
        IconLeft={Download}
        className={styles.download}
        variant="text"
        iconColor="var(--MediumEmphasis)"
      />
    </Modal>
  );
};
