import moment from 'moment';
import styles from './operation.module.scss';
import { useRef } from 'react';
import { getOrderViewOperation } from '../../../api/orderView';

import { useOutsideClick } from '../../../functions/useOutsideClick';

import {
  NoVideo,
  CheckCircle,
  Error,
  QuestionSquere,
  VideoCamera,
} from '../../../assets/svg/SVGcomponent';

export const Operation = ({ operation, x, y, onClose, setOperationOV }) => {
  const refOperation = useRef(null);
  useOutsideClick(refOperation, () => onClose());

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
      <div className={styles.operation} style={{ top: y, left: x }} ref={refOperation}>
        <span className={styles.name}>{operation.oprName}</span>
        <div>
          {operation.video && operation.video.status ? (
            <span onClick={() => operationClickHandler(operation.id)} className={styles.video}>
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
        <span className={styles.name}>{`${operation.frsName} ${operation.lstName}`}</span>
        <span className={styles.respTime}>{`${moment(operation.sTime).format(
          'HH:mm:ss'
        )} - ${moment(operation.eTime).format('HH:mm:ss')}`}</span>
        <span className={styles.status}>
          {' '}
          {operation.status === null && <QuestionSquere color={'var(--LowEmphasis)'} />}
          {operation.status && <CheckCircle color={'var(--Green)'} />}
          {operation.status === false && <Error color={'var(--Red)'} />}
        </span>
      </div>
    </>
  );
};
