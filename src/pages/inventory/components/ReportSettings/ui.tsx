import styles from './reportSettings.module.scss';
import { Edit, Delete } from '../../../../assets/svg/SVGcomponent';
import { useAppDispatch } from '../../../../store/hooks';
import {
  setIsOpenEditModal,
  setCurrentEditItem,
} from '../EditInventoryModal/editInventoryModalSlice';
import { InventoryItem } from '../../../../storage/inventory';
import { useEffect, useRef } from 'react';

type PropsType = {
  currentReport: InventoryItem;
  coordinates: { x: number; y: number };
  outsideClick: (value: boolean) => void;
};

export const ReportSettings: React.FC<PropsType> = ({
  currentReport,
  coordinates,
  outsideClick,
}) => {
  const dispatch = useAppDispatch();
  const settingsRef = useRef(null);

  const openEditModal = (currentItem: InventoryItem) => {
    dispatch(setCurrentEditItem(currentItem));
    dispatch(setIsOpenEditModal(true));
    outsideClick(false);
  };

  const clickHandler = (event: MouseEvent) => {
    if (settingsRef.current && !(settingsRef.current as Element).contains(event.target as Node)) {
      outsideClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', clickHandler, true);

    return () => document.removeEventListener('click', clickHandler, true);
  }, []);

  return (
    <div
      ref={settingsRef}
      style={{ top: coordinates.y + 24, left: coordinates.x }}
      className={styles.settingsContainer}
    >
      <div className={styles.settingsMenu}>
        <div className={styles.settingsMenu_item} onClick={() => openEditModal(currentReport)}>
          <Edit />
          <p className={styles.settingsText}>Edit</p>
        </div>
        <div className={styles.settingsMenu_item}>
          <Delete />
          <p className={styles.settingsText}>Delete</p>
        </div>
      </div>
    </div>
  );
};
