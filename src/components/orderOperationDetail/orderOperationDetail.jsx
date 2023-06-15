import { useRef } from 'react';
import { Modal } from '../modal';
import styles from './orderOperationDetail.module.scss';
import ReactPlayer from 'react-player';
import { Download } from '../../assets/svg/SVGcomponent';
import { Button } from '../button';
import noVideo from '../../assets/png/novideo.png';
export const OrderOperationDetail = ({ operationData, handleClose }) => {
  const playerRef = useRef(null);
  const handleReady = () => {
    playerRef.current.seekTo(30); // Начинаем с 30-й секунды
  };

  const handleDownload = () => {
    if (operationData && operationData.video && operationData.video.status) {
      const videoUrl = `${
        process.env.REACT_APP_ENV === 'proxy'
          ? `${process.env.REACT_APP_NGROK}`
          : process.env.REACT_APP_ENV === 'wify'
          ? `${process.env.REACT_APP_IP_SERVER}`
          : `http://${window.location.hostname}`
      }/${operationData?.video.file_name}`; // Замените на ссылку на ваше видео

      fetch(videoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = operationData?.video.file_name; // Замените на имя файла, под которым нужно сохранить видео
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  };

  return (
    <Modal
      isOpen={true}
      handleClose={handleClose}
      className={styles.modal}
      showCross
      showSubstrateCross
    >
      {operationData.video && operationData.video.status && operationData?.video.file_name ? (
        <video
          id="videoPlayer"
          src={`${
            process.env.REACT_APP_ENV === 'proxy'
              ? `http://192.168.1.110:3456/video?time=${operationData.sTime}&camera_ip=${
                  operationData.cameraIP
                }#t=${operationData.video.video_start_from / 1000}`
              : process.env.REACT_APP_ENV === 'wify'
              ? `http://192.168.1.110:3456/video?time=${operationData.sTime}&camera_ip=${
                  operationData.cameraIP
                }#t=${operationData.video.video_start_from / 1000}`
              : `http://${window.location.hostname}:3456/video?time=${
                  operationData.sTime
                }&camera_ip=${operationData.cameraIP}#t=${
                  operationData.video.video_start_from / 1000
                }`
          }`}
          controls
          autoPlay
        ></video>
      ) : (
        <img alt="no video" src={noVideo} />
      )}

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.header_title}>{operationData?.operationName}</p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.subtitle_value}>
              {operationData && new Date(operationData.sTime).toLocaleDateString()}
            </span>
            <span className={styles.subtitle_value}>{' | '}</span>
            <span className={styles.subtitle_value}>
              {operationData && new Date(operationData.eTime).toLocaleTimeString()}
            </span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Order: '}</span>
            <span className={styles.subtitle_value}>{operationData?.orId}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Worker: '}</span>
            <span className={styles.subtitle_value}>{operationData?.frsName}</span>&nbsp;
            <span className={styles.subtitle_value}>{operationData?.lstName}</span>
          </div>
          <div className={styles.subtitle}>
            <span>{'Product: '}</span>
            <span className={styles.subtitle_value}>{operationData?.elType}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Frame: '}</span>
            <span className={styles.subtitle_value}>{'Frame name'}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDownload}
        IconLeft={Download}
        className={styles.download}
        variant="text"
        iconColor="var(--MediumEmphasis)"
      />
    </Modal>
  );
};
