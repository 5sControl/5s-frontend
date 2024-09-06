import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import styles from './operation.module.scss';
import { useOutsideClick } from '../../../functions/useOutsideClick';
import { NoVideo, CheckCircle, Error, QuestionSquere, VideoCamera } from '../../../assets/svg/SVGcomponent';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';
import { getOrderViewOperation } from '../../../api/orderView';
import { getVideo } from '../../../api/cameraRequest';

export const Operation = ({ content, x, y, onClose, setOperationOV }) => {
  const refOperation = useRef(null);
  const [loading, setLoading] = useState(true);
  const [operation, setOperation] = useState(content);

  useOutsideClick(refOperation, () => onClose());

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        if (content.zoneId) {
          getVideo(window.location.hostname, {
            camera_ip: content.camera,
            time: content.sTime,
          }).then((res) => {
            setOperation({
              data: {
                ...content.buf,
                video: res.data,
              }
            })
          })
        }
        await getOrderViewOperation(window.location.hostname, '', content.id)
          .then((response) => {
            setOperation(response.data)
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [content]);

  const operationClickHandler = () => {
    setOperationOV(operation);
  };

  return (
    <div className={styles.operation} style={{ top: y, left: x }} ref={refOperation}>
      {operation.algorithm && (
        <span className={styles.name}>{parsingAlgorithmName(operation.algorithm)}</span>
      )}
      {operation.oprName && <span className={styles.name}>{operation.oprName}</span>}
      <div>
        {loading ? (
          <span className={styles.loading}>Loading...</span>
        ) : operation.video && operation.video.status ? (
          <span onClick={operationClickHandler} className={styles.video}>
            <VideoCamera width="16px" color="#fe6100" />
            &nbsp; Open Video
          </span>
        ) : (
          <span className={styles.noVideo}>
            <NoVideo />
            &nbsp; No video
          </span>
        )}
      </div>
      {operation.cameraName && (
        <span className={styles.name}>{parsingAlgorithmName(operation.cameraName)}</span>
      )}
      {operation.frsName && operation.lstName && (
        <span className={styles.name}>{`${operation.frsName} ${operation.lstName}`}</span>
      )}
      <span className={styles.respTime}>{`${moment(operation.sTime).format('HH:mm:ss')} - ${moment(operation.eTime).format('HH:mm:ss')}`}</span>
      <span className={styles.status}>
        {operation.status === null && <QuestionSquere color={'var(--LowEmphasis)'} />}
        {operation.status && <CheckCircle color={'var(--Green)'} />}
        {operation.status === false && <Error color={'var(--Red)'} />}
      </span>
    </div>
  );
};