import { useRef } from 'react';
import { Modal } from '../modal';
import styles from './orderOperationDetail.module.scss';
import ReactPlayer from 'react-player';
import { Download } from '../../assets/svg/SVGcomponent';
import { Button } from '../button';

export const OrderOperationDetail = ({ operationData, handleClose }) => {
  const playerRef = useRef(null);

  const handleReady = () => {
    playerRef.current.seekTo(30); // Начинаем с 30-й секунды
  };

  const downloadVideo = () => {
    const videoUrl = `https://743e-134-17-26-206.ngrok-free.app/${operationData?.video_data.file_name}`;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'video.mp4'; // Название файла для скачивания
    link.click();
  };

  const handleDownload = () => {
    if (operationData && operationData.video_data && operationData.video_data.status) {
      const videoUrl = `${
        process.env.REACT_APP_ENV === 'proxy'
          ? `${process.env.REACT_APP_NGROK}`
          : process.env.REACT_APP_ENV === 'wify'
          ? `${process.env.REACT_APP_IP_SERVER}`
          : `http://${window.location.hostname}`
      }/${operationData?.video_data.file_name}`; // Замените на ссылку на ваше видео
      fetch(videoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = operationData?.video_data.file_name; // Замените на имя файла, под которым нужно сохранить видео
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
      <ReactPlayer
        ref={playerRef}
        width="100%"
        height="100%"
        playing={true}
        volume={0.9}
        controls={true}
        preload="auto"
        url={`${
          process.env.REACT_APP_ENV === 'proxy'
            ? `${process.env.REACT_APP_NGROK}`
            : process.env.REACT_APP_ENV === 'wify'
            ? `${process.env.REACT_APP_IP_SERVER}`
            : `http://${window.location.hostname}`
        }/${operationData?.video_data.file_name}`}
        // onReady={handleReady}
      />

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <p className={styles.header_title}>{operationData?.operationName}</p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.subtitle}>
            <span>{'Operation start: '}</span>
            <span className={styles.subtitle_value}>
              {operationData && new Date(operationData.startTime).toLocaleDateString()}
            </span>
            <span className={styles.subtitle_value}>{' | '}</span>
            <span className={styles.subtitle_value}>
              {operationData && new Date(operationData.startTime).toLocaleTimeString()}
            </span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Order: '}</span>
            <span className={styles.subtitle_value}>{operationData?.orderId}</span>
          </div>

          <div className={styles.subtitle}>
            <span>{'Worker: '}</span>
            <span className={styles.subtitle_value}>{operationData?.firstName}</span>&nbsp;
            <span className={styles.subtitle_value}>{operationData?.lastName}</span>
          </div>
          <div className={styles.subtitle}>
            <span>{'Product: '}</span>
            <span className={styles.subtitle_value}>{operationData?.orderId}</span>
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
