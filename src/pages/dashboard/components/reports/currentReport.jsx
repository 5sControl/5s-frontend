import { useState, useEffect } from 'react';
import moment from 'moment';

import { ViolintationFalse, ViolintationTrue } from '../../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName.js';
import { selectCurrentReport } from '../../../../store/dataSlice';
import { useAppSelector } from '../../../../store/hooks';
import { ZoomOut } from '../../../../components/zoomOut';
import ImageSlider from '../../../../components/slider/slider';
import { Scale } from '../../../../components/scale';
import { Modal } from '../../../../components/modal';

import styles from './currentReport.module.scss';

export const CurrentReport = () => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    setCurrentCount(0);
  }, [currentReport]);

  return (
    <>
      {currentReport && (
        <>
          <div className={styles.report}>
            <div className={styles.report_image}>
              {currentReport && (
                <ImageSlider
                  images={currentReport.photos}
                  setCurrentCount={(num) => setCurrentCount(num)}
                  currentCount={currentCount}
                />
              )}
              <Scale onClick={() => setFullImage(true)} className={styles.report_scale} />
            </div>
            <div className={styles.report_item}>
              <span className={styles.legend}>Date & Time</span>
              <span className={styles.text}>
                {moment
                  .utc(currentReport.start_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('YYYY-MM-DD ')}
                |
                {moment
                  .utc(currentReport.start_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('HH:mm:ss')}
                -
                {moment
                  .utc(currentReport.stop_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('HH:mm:ss')}
              </span>
            </div>
            <div className={styles.report_item}>
              <span className={styles.legend}>Camera</span>
              <span className={styles.text}>
                {currentReport.camera ? currentReport.camera.name : 'Deleted Camera'}
              </span>
            </div>
            <div className={styles.report_item}>
              <span className={styles.legend}>Algorithm</span>

              <span className={styles.text}>
                {parsingAlgorithmName(currentReport.algorithm.name)}
              </span>
            </div>
            <div className={styles.report_item}>
              <span className={styles.legend}>Status</span>
              <span className={styles.text}>
                {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
              </span>
            </div>
          </div>
        </>
      )}
      {fullImage && (
        <Modal isOpen={true} handleClose={() => setFullImage(false)} className={styles.fullImage}>
          <div className={styles.fullImage__container}>
            <ImageSlider
              images={currentReport.photos}
              setCurrentCount={(num) => setCurrentCount(num)}
              currentCount={currentCount}
            />
            <ZoomOut className={styles.fullImage__scale} onClick={() => setFullImage(false)} />
          </div>
        </Modal>
      )}
    </>
  );
};
