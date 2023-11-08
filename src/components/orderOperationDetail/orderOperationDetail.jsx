import { useEffect, useRef, useState } from 'react';
import { Modal } from '../modal';
import styles from './orderOperationDetail.module.scss';
import { ArrowLeft, ArrowRight, Download } from '../../assets/svg/SVGcomponent';
import { Button } from '../button';
import noVideo from '../../assets/png/novideo.png';
import ReactPlayer from 'react-player';
import { parsingAlgorithmName } from '../../functions/parsingAlgorithmName';
import moment from 'moment';
import { getVideo } from '../../api/cameraRequest';

function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const OrderOperationDetail = ({ operationData, handleClose }) => {
  const [operationDataNew, setOperationDataNew] = useState(operationData);
  const playerRef = useRef(null);
  const handleDownload = () => {
    if (operationDataNew && operationDataNew.video && operationDataNew.video.status) {
      const videoUrl = `${
        process.env.REACT_APP_ENV === 'proxy'
          ? `${process.env.REACT_APP_NGROK}`
          : process.env.REACT_APP_ENV === 'wify'
          ? `${process.env.REACT_APP_IP_SERVER}`
          : `${location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.hostname}`
      }/${operationDataNew?.video.file_name}`; // Замените на ссылку на ваше видео

      downloadFile(videoUrl, operationDataNew.video.file_name);
    }
  };
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

  return (
    <Modal
      isOpen={true}
      handleClose={handleClose}
      className={styles.modal}
      showCross
      showSubstrateCross
    >
      {operationDataNew.video && operationDataNew.video.status && operationDataNew.cameraIP ? (
        <>
          {operationDataNew && (
            <video
              id="videoPlayer"
              src={`${`${process.env.REACT_APP_NGROK}api/onvif/video?time=${
                operationDataNew.sTime
              }&camera_ip=${operationDataNew.cameraIP}#t=${
                operationDataNew.video.video_start_from
                  ? operationDataNew.video.video_start_from / 1000
                  : 0
              }`}`}
              controls
              autoPlay
            ></video>
          )}

          <div className={styles.time}>
            <ArrowLeft className={styles.svg} onClick={() => arrowHandler('prev')} />
            <div className={styles.time__container}>
              <span>{moment(operationDataNew.sTime).format('HH:mm:ss')} -</span>
              <span>{moment(operationDataNew.eTime).format('HH:mm:ss')}</span>
            </div>
            <ArrowRight className={styles.svg} onClick={() => arrowHandler('next')} />
          </div>
        </>
      ) : operationDataNew.video &&
        operationDataNew.video.status &&
        operationDataNew?.video.file_name ? (
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          playing={true}
          volume={0.9}
          controls={true}
          preload="auto"
          config={{
            file: {
              forceVideo: true,
            },
          }}
          url={`${
            process.env.REACT_APP_ENV === 'proxy'
              ? `${process.env.REACT_APP_NGROK}`
              : process.env.REACT_APP_ENV === 'wify'
              ? `${process.env.REACT_APP_IP_SERVER}`
              : `http://${window.location.hostname}`
          }/${operationDataNew?.video.file_name}`}
        />
      ) : (
        <img alt="no video" src={noVideo} />
      )}

      <div className={styles.infoBlock}>
        {operationData?.operationName && (
          <div className={styles.header}>
            <p className={styles.header_title}>{operationData?.operationName}</p>
          </div>
        )}
        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.subtitle_value}>
              {operationData && moment(operationData?.sTime).format('YYYY-MM-DD | HH:mm:ss')}
            </span>
          </div>
          {operationData?.cameraName && (
            <div className={styles.subtitle}>
              <span>{'Camera: '}</span>
              <span className={styles.subtitle_value}>{operationData?.cameraName}</span>
            </div>
          )}
          {operationData?.algorithm && (
            <div className={styles.subtitle}>
              <span>{'Algorihm: '}</span>
              <span className={styles.subtitle_value}>
                {parsingAlgorithmName(operationData?.algorithm)}
              </span>
            </div>
          )}
          {operationData?.orId && (
            <div className={styles.subtitle}>
              <span>{'Order: '}</span>
              <span className={styles.subtitle_value}>{operationData?.orId}</span>
            </div>
          )}

          {(operationData?.frsName || operationData?.lstName) && (
            <div className={styles.subtitle}>
              <span>{'Worker: '}</span>
              <span className={styles.subtitle_value}>{operationData?.frsName}</span>&nbsp;
              <span className={styles.subtitle_value}>{operationData?.lstName}</span>
            </div>
          )}

          {operationData?.elType && (
            <div className={styles.subtitle}>
              <span>{'Product: '}</span>
              <span className={styles.subtitle_value}>{operationData?.elType}</span>
            </div>
          )}

          {/* <div className={styles.subtitle}>
            <span>{'Frame: '}</span>
            <span className={styles.subtitle_value}>{'Frame name'}</span>
          </div> */}
        </div>
      </div>

      {operationDataNew?.video && operationDataNew?.video.file_name && (
        <Button
          onClick={handleDownload}
          IconLeft={Download}
          className={styles.download}
          variant="text"
          iconColor="var(--MediumEmphasis)"
        />
      )}
    </Modal>
  );
};
