import { useState } from 'react';
import moment from 'moment';

import { ViolintationFalse, ViolintationTrue } from '../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName.js';
import ImageSlider from '../../../components/slider/slider';

import { selectCurrentReport } from '../../../store/dataSlice';
import { useAppSelector } from '../../../store/hooks';

import styles from './current-report.module.scss';

export const CurrentReport = ({ camera }) => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  return (
    <>
      {currentReport ? (
        <div className={styles.report}>
          <div className={styles.report__image}>
            {currentReport && (
              <ImageSlider
                images={currentReport.photos}
                setCurrentCount={(num) => setCurrentCount(num)}
                currentCount={currentCount}
              />
            )}
          </div>
          <div className={styles.report__description}>
            <span>
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

            <div className={styles.report_item}>
              <span>{currentReport.camera ? currentReport.camera.name : 'Deleted Camera'}</span>
            </div>
            <div className="current-report_item">
              <span>{parsingAlgorithmName(currentReport.algorithm.name)}</span>
            </div>
            <div className={styles.report_item}>
              <span>
                {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {camera !== 'camera' && (
            <div className={styles.report}>
              <video
                id="videoPlayer"
                src={`http://${window.location.hostname}:3456/stream?camera_ip=${camera}`}
                controls
                autoPlay
              ></video>
            </div>
          )}
        </>
      )}
      {fullImage && (
        <>
          <div className={styles.report__fullimage} onClick={() => setFullImage(false)}>
            <img src={fullImage} alt="report img" className={styles.report__fullimage_image} />
          </div>
        </>
      )}
    </>
  );
};
