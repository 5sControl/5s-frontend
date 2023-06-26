import { useEffect, useState } from 'react';
import moment from 'moment';

import {
  ViolintationFalse,
  ViolintationTrue,
  ArrowLeft,
  ArrowRight,
} from '../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName.js';
import ImageSlider from '../../../components/slider/slider';

import { selectCurrentReport } from '../../../store/dataSlice';
import { useAppSelector } from '../../../store/hooks';

import styles from './current-report.module.scss';
import { getVideo } from '../../../api/cameraRequest.js';

export const CurrentReport = ({ camera }) => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [operationDataNew, setOperationDataNew] = useState(false);

  const arrowHandler = (text) => {
    let body = {};

    if (text === 'prev') {
      body = {
        camera_ip: operationDataNew.cameraIP,
        time: operationDataNew.video.date_start - 120000,
      };
    } else {
      body = {
        camera_ip: operationDataNew.cameraIP,
        time: operationDataNew.video.date_end + 1000,
      };
    }
    getVideo(window.location.hostname, body).then((res) => {
      const resp = {
        ...operationDataNew,
        sTime: body.time,
        eTime: body.time + 120000,
        video: res.data,
      };
      setOperationDataNew(() => {
        return { ...resp };
      });
    });
  };

  useEffect(() => {
    console.log(currentReport);
    if (currentReport) {
      const body = {
        camera_ip: currentReport.camera.id,
        time: new Date(currentReport.start_tracking).valueOf() + 10800000,
      };
      getVideo(window.location.hostname, body).then((res) => {
        if (Object.keys(res.data).length && res.data.status) {
          const value = {
            cameraIP: currentReport.camera.id,
            cameraName: currentReport.camera.name,
            algorithm: currentReport.algorithm.name,
            sTime: new Date(currentReport.start_tracking).valueOf() + 10800000,
            eTime: new Date(currentReport.stop_tracking).valueOf() + 10800000,
            video: res.data,
          };
          // console.log(value);
          setOperationDataNew(value);
        } else {
          setOperationDataNew(false);
        }
      });
    } else {
      setOperationDataNew(false);
    }
  }, [currentReport]);
  return (
    <>
      {currentReport ? (
        <div className={styles.report}>
          <div className={styles.report__image}>
            {currentReport && (
              <>
                {operationDataNew ? (
                  <>
                    <video
                      id="videoPlayer"
                      src={`${
                        process.env.REACT_APP_ENV === 'proxy'
                          ? `http://192.168.1.110:3456/video?time=${
                              operationDataNew.sTime
                            }&camera_ip=${operationDataNew.cameraIP}#t=${
                              operationDataNew.video.video_start_from
                                ? operationDataNew.video.video_start_from / 1000
                                : 0
                            }`
                          : process.env.REACT_APP_ENV === 'wify'
                          ? `http://192.168.1.110:3456/video?time=${
                              operationDataNew.sTime
                            }&camera_ip=${operationDataNew.cameraIP}#t=${
                              operationDataNew.video.video_start_from
                                ? operationDataNew.video.video_start_from / 1000
                                : 0
                            }`
                          : `http://${window.location.hostname}:3456/video?time=${
                              operationDataNew.sTime
                            }&camera_ip=${operationDataNew.cameraIP}#t=${
                              operationDataNew.video.video_start_from
                                ? operationDataNew.video.video_start_from / 1000
                                : 0
                            }`
                      }`}
                      controls
                      autoPlay
                      onEnded={() => arrowHandler('next')}
                    ></video>
                    <div className={styles.time}>
                      <ArrowLeft className={styles.svg} onClick={() => arrowHandler('prev')} />
                      <div className={styles.time__container}>
                        <span>{moment(operationDataNew.sTime).format('HH:mm:ss')} -</span>
                        <span>{moment(operationDataNew.eTime).format('HH:mm:ss')}</span>
                      </div>
                      <ArrowRight className={styles.svg} onClick={() => arrowHandler('next')} />
                    </div>
                  </>
                ) : (
                  <ImageSlider
                    images={currentReport.photos}
                    setCurrentCount={(num) => setCurrentCount(num)}
                    currentCount={currentCount}
                  />
                )}
              </>
            )}
          </div>
          {/* <div className={styles.report__description}>
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
          </div> */}
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
