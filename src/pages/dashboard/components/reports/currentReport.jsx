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
import { getOrderViewOperation } from '../../../../api/orderView.js';
import { OrderOperationDetail } from '../../../../components/orderOperationDetail/orderOperationDetail.jsx';
import { Notification } from '../../../../components/notification/notification';

import { getVideo } from '../../../../api/cameraRequest.js';

export const CurrentReport = () => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [operationOV, setOperationOV] = useState(false);
  const videoClickHandler = (element) => {
    const body = {
      camera_ip: element.camera.id,
      time: new Date(element.start_tracking).valueOf() + 10800000,
    };
    // console.log(body);
    getVideo(window.location.hostname, body).then((res) => {
      if (Object.keys(res.data).length) {
        const value = {
          cameraIP: element.camera.id,
          cameraName: element.camera.name,
          algorithm: element.algorithm.name,
          sTime: new Date(element.start_tracking).valueOf() + 10800000,
          eTime: new Date(element.stop_tracking).valueOf() + 10800000,
          video: res.data,
        };
        // console.log(value);
        setOperationOV(value);
      } else {
        setOperationOV(`Operation #${element.id} was not found in the database`);
      }
    });
  };

  useEffect(() => {
    if (operationOV && typeof operationOV === 'string') {
      setTimeout(() => setOperationOV(false), 2000);
    }
  }, [operationOV]);

  useEffect(() => {
    setCurrentCount(0);
  }, [currentReport]);

  const operationClickHandler = (id) => {
    getOrderViewOperation(window.location.hostname, '', id).then((res) => {
      if (Object.keys(res.data).length) {
        setOperationOV(res.data);
      } else {
        setOperationOV(`Operation #${id} was not found in the database`);
      }
    });
  };
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
                  .format('MMM DD ')}
                |{moment(new Date(currentReport.start_tracking)).format('HH:mm:ss')}-
                {moment(new Date(currentReport.start_tracking)).format('HH:mm:ss')}
              </span>
            </div>
            <div className={styles.report_item}>
              <span className={styles.legend}>Camera</span>
              <span className={styles.text}>
                {currentReport.camera
                  ? `${
                      currentReport.extra && currentReport.extra.zoneName
                        ? `${currentReport.camera.name} | ${currentReport.extra.zoneName}`
                        : currentReport.camera.name
                    }`
                  : 'Deleted camera'}
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
            <div className={styles.report_item}>
              <span className={styles.legend}>Additional</span>
              <span
                className={`${styles.text} ${styles.link}`}
                onClick={() => videoClickHandler(currentReport)}
              >
                Open video
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
      {operationOV && typeof operationOV === 'object' && (
        <OrderOperationDetail
          operationData={operationOV}
          handleClose={() => setOperationOV(false)}
        />
      )}

      {operationOV && typeof operationOV === 'string' && (
        <Notification status={false} message={operationOV} />
      )}
    </>
  );
};
