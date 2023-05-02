import styles from './reportSettings.module.scss';
import { Delete, Edit } from '../../../../assets/svg/SVGcomponent';
import { useAppDispatch } from '../../../../store/hooks';
import {
  setIsOpenEditModal,
  setCurrentEditItem,
} from '../EditInventoryModal/editInventoryModalSlice';
import { useEffect, useRef } from 'react';
import {
  setCurrentDeleteItemId,
  setIsOpenDeleteModal,
} from '../DeleteInventoryModal/deleteInventoryModalSlice';
import { InventoryItem } from '../../types';

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

  const openDeleteModal = () => {
    dispatch(setCurrentDeleteItemId(currentReport.id));
    dispatch(setIsOpenDeleteModal(true));
    outsideClick(false);
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
        <div className={styles.settingsMenu_item} onClick={openDeleteModal}>
          <Delete />
          <p className={styles.settingsText}>Delete</p>
        </div>
      </div>
    </div>
  );
};
