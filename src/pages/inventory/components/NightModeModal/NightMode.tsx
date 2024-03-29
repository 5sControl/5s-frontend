import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './nightModeModal.module.scss';
import { nightTimeSet, nightTimeGet, selectNightInventoryModal } from './NightModeSlice';
import { NightModeResponse } from './types';
import { Input } from '../../../../components/input';
import { Tooltip } from '../../../../assets/svg/SVGcomponent';
import { GrClose } from 'react-icons/gr';
import moment from 'moment';
type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const NightModeModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { nightTime } = useAppSelector(selectNightInventoryModal);
  const [cookies] = useCookies(['token']);
  const [tooltip, setTooltip] = useState(false);
  const [time, setTime] = useState<NightModeResponse>({
    time_start: '',
    time_end: '',
  });

  useEffect(() => {
    dispatch(
      nightTimeGet({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);
  useEffect(() => {
    if (nightTime) {
      const localTimeStart = moment(nightTime.time_start, 'HH:mm');
      const localTimeEnd = moment(nightTime.time_end, 'HH:mm');
      setTime({
        time_start: localTimeStart.utc().format('HH:mm'),
        time_end: localTimeEnd.utc().format('HH:mm'),
      });
    }
  }, [nightTime]);

  const deleteAction = () => {
    const bufTime: NightModeResponse = time;
    if (!bufTime.time_end.includes(':')) {
      const localTime = moment(bufTime.time_end + ':00', 'HH:mm');
      bufTime.time_end = localTime.utc().format('HH:mm');
    } else {
      const localTime = moment(bufTime.time_end, 'HH:mm');
      bufTime.time_end = localTime.utc().format('HH:mm');
    }
    if (!bufTime.time_start.includes(':')) {
      const localTime = moment(bufTime.time_start + ':00', 'HH:mm');
      bufTime.time_start = localTime.utc().format('HH:mm');
    } else {
      const localTime = moment(bufTime.time_start, 'HH:mm');
      bufTime.time_start = localTime.utc().format('HH:mm');
    }
    dispatch(
      nightTimeSet({
        token: cookies.token,
        hostname: window.location.hostname,
        bufTime,
      })
    );
    handleClose();
  };
  const handleReset = () => {
    setTime({
      time_start: '',
      time_end: '',
    });
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <h1 className={styles.header}>
        <span>Inventory settings</span>
        <GrClose className={styles.closeCross} onClick={handleClose} />
      </h1>
      <h4 className={styles.text}>
        Working time{' '}
        <Tooltip
          className={styles.tooltipSVG}
          onMouseMove={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
        />
        {tooltip && (
          <div className={styles.tooltip}>
            <h6>Working time</h6>
            <p>
              The Working time field is a feature that enables the user to specify the operational
              hours of a manufacturing facility. By setting the working time, the system will be
              aware of when the facility is not in operation, and will not send notifications about
              low stock level during that time. The tracking of items will continue but it might be
              inaccurate due to bad lightning conditions.
            </p>
          </div>
        )}
      </h4>
      <div className={styles.inputs}>
        <div className={styles.inputs__left}>
          <p>Start</p>
          <Input
            id="start"
            name="start"
            type="text"
            value={time.time_start}
            onChange={(e) =>
              setTime({ ...time, time_start: e.target.value.replace(/[^\d.:]/g, '') })
            }
            className={styles.input}
            placeholder="Enter time, e.g. 08:00"
          />
        </div>
        <div className={styles.inputs__right}>
          <p>End</p>
          <Input
            id="end"
            name="end"
            type="text"
            value={time.time_end}
            onChange={(e) => setTime({ ...time, time_end: e.target.value.replace(/[^\d:]/g, '') })}
            className={styles.input}
            placeholder="Enter time, e.g. 18:00"
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <Button text="Reset" className={styles.cancel} onClick={handleReset} />
        <Button text="Done" onClick={deleteAction} />
      </div>
    </Modal>
  );
};
