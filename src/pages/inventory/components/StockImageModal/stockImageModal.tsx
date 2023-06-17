import { Modal } from '../../../../components/modal';
import styles from './stockImageModal.module.scss';
import moment from 'moment-timezone';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { setDateDot } from '../../../previewOrders/previewOrdersHelper';
import { HistoryExtra, InventoryHistory } from '../../types';
import { getExtraOfActiveData } from '../../helper';
import { Scale } from '../../../../components/scale';
import { useEffect, useState } from 'react';
import { ZoomOut } from '../../../../components/zoomOut';
import { selectInventory } from '../../inventorySlice';
import { setCurrentReportData } from '../StockImageModal/stockImageModalSlice';
import { CrossWhite, Prev } from '../../../../assets/svg/SVGcomponent';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  currentReport: InventoryHistory;
};

export const StockImageModal: React.FC<PropsType> = ({ isOpen, handleClose, currentReport }) => {
  const dispatch = useAppDispatch();
  const operationStart =
    setDateDot(moment(currentReport.start_tracking).format('DD.MM.YYYY')) +
    ' | ' +
    moment.utc(currentReport.start_tracking).utcOffset(moment().utcOffset()).format('LT');

  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  // console.log(currentReport);
  const setExtraOfActiveData = (extra: Array<HistoryExtra>) => {
    return getExtraOfActiveData(extra, activeInventoryItem);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fullImage, setFullImage] = useState<any>(false);
  const { inventoryHistoryData } = useAppSelector(selectInventory);

  const currentIndex = inventoryHistoryData?.indexOf(currentReport) || 1;

  useEffect(() => {
    setFullImage(false);
  }, [isOpen]);

  const disablaFullImage = () => {
    setFullImage(false);
  };
  useEffect(() => {
    if (fullImage) {
      const closeOnEscapeKey = (e: KeyboardEvent) =>
        e.key === 'Escape' ? disablaFullImage() : null;
      document.body.addEventListener('keydown', closeOnEscapeKey);
      return () => {
        document.body.removeEventListener('keydown', closeOnEscapeKey);
      };
    }
  }, [fullImage]);

  const prevReport = () => {
    const prevReport = inventoryHistoryData
      ? inventoryHistoryData[currentIndex - 1]
      : currentReport;

    dispatch(setCurrentReportData(prevReport));
  };

  const nextReport = () => {
    const nextReport = inventoryHistoryData
      ? inventoryHistoryData[currentIndex + 1]
      : currentReport;

    dispatch(setCurrentReportData(nextReport));
  };

  useEffect(() => {
    const arrowKey = (e: KeyboardEvent) => {
      if (
        inventoryHistoryData &&
        inventoryHistoryData?.indexOf(currentReport) > 0 &&
        e.key === 'ArrowLeft'
      ) {
        prevReport();
      }
      if (
        inventoryHistoryData &&
        inventoryHistoryData?.indexOf(currentReport) < inventoryHistoryData.length - 1 &&
        e.key === 'ArrowRight'
      ) {
        nextReport();
      }
    };
    document.body.addEventListener('keydown', arrowKey);
    return () => {
      document.body.removeEventListener('keydown', arrowKey);
    };
  }, [handleClose]);

  // console.log(operationStart, 'sdfsdf');
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={styles.modal}
      showSubstrateCross={true}
      noESC={fullImage}
    >
      <div
        className={styles.imageContainer}
        style={{
          backgroundImage: `url(${
            process.env.REACT_APP_ENV === 'proxy'
              ? `${process.env.REACT_APP_NGROK}${
                  setExtraOfActiveData(currentReport.extra).image_item
                }`
              : process.env.REACT_APP_ENV === 'wify'
              ? `${process.env.REACT_APP_IP_SERVER}${
                  setExtraOfActiveData(currentReport.extra).image_item
                }`
              : `http://${window.location.hostname}/${
                  setExtraOfActiveData(currentReport.extra).image_item
                }`
          })`,
        }}
      >
        <div className={styles.camera}>
          <p className={styles.text}>{activeInventoryItem?.camera}</p>
        </div>
        {inventoryHistoryData && inventoryHistoryData?.indexOf(currentReport) > 0 && (
          <Prev className={styles.prev} onClick={prevReport} />
        )}
        {inventoryHistoryData &&
          inventoryHistoryData?.indexOf(currentReport) < inventoryHistoryData.length - 1 && (
            <Prev className={styles.next} onClick={nextReport} />
          )}
        <Scale
          className={styles.scale}
          onClick={() =>
            setFullImage(
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK}${
                    setExtraOfActiveData(currentReport.extra).image_item
                  }`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}${
                    setExtraOfActiveData(currentReport.extra).image_item
                  }`
                : `http://${window.location.hostname}/${
                    setExtraOfActiveData(currentReport.extra).image_item
                  }`
            )
          }
        />
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.operation}>{activeInventoryItem?.name}</p>
          <p
            className={`${styles.status} ${
              setExtraOfActiveData(currentReport.extra).status === 'In stock' && styles.statusStock
            } ${
              setExtraOfActiveData(currentReport.extra).status === 'Low stock level' &&
              styles.statusLowStock
            } ${
              setExtraOfActiveData(currentReport.extra).status === 'Out of stock' &&
              styles.statusOutStock
            }`}
          >
            {setExtraOfActiveData(currentReport.extra).status}
          </p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Stock level at the time : '}</span>
            <span className={styles.value}>{setExtraOfActiveData(currentReport.extra).count}</span>
          </div>

          {setExtraOfActiveData(currentReport.extra).low_stock_level && (
            <div className={styles.subtitle}>
              <span>{'Low stock level: '}</span>
              <span className={styles.value}>
                {setExtraOfActiveData(currentReport.extra).low_stock_level}
              </span>
            </div>
          )}

          <div className={styles.subtitle}>
            <span>{'Time: '}</span>
            <span className={styles.value}>{operationStart}</span>
          </div>
          <div className={styles.close} onClick={handleClose}>
            <CrossWhite />
          </div>
        </div>
      </div>
      {fullImage && (
        <>
          <div className={styles.fullimage}>
            <img src={fullImage} alt="report img" className={styles.fullimage_image} />
            <ZoomOut onClick={() => setFullImage(false)} className={styles.fullimage_out} />
          </div>
        </>
      )}
    </Modal>
  );
};
