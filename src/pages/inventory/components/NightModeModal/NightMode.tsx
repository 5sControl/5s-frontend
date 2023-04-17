import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import styles from './nightModeModal.module.scss';
import { nightTimeSet, nightTimeGet, selectNightInventoryModal } from './NightModeSlice';
import { NightModeResponse } from './types';
import { Input } from '../../../../components/input';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const NightModeModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { nightTime } = useAppSelector(selectNightInventoryModal);
  const [cookies] = useCookies(['token']);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    );
  }, []);

  useEffect(() => {
    if (nightTime) {
      setTime({
        time_start: nightTime.time_start.slice(0, -3),
        time_end: nightTime.time_end.slice(0, -3),
      });
    }
  }, [nightTime]);

  const deleteAction = () => {
    dispatch(
      nightTimeSet({
        token: cookies.token,
        hostname: window.location.hostname,
        time,
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
      <h1 className={styles.header}>Inventory settings</h1>
      <h4 className={styles.text}>Working time</h4>
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
