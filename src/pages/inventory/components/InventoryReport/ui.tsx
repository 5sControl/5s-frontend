import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { Settings, Edit, Delete } from '../../../../assets/svg/SVGcomponent';
import styles from './inventoryReport.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { EditInventoryModal } from '../EditInventoryModal';
import {
  selectEditInventoryModal,
  setIsOpenEditModal,
  setCurrentEditItem,
} from '../EditInventoryModal/editInventoryModalSlice';
import { InventoryItem } from '../../../../storage/inventory';
import { ReportSettings } from '../ReportSettings';

export const InventoryReport: React.FC = () => {
  const { inventoryItems } = useAppSelector(selectInventory);
  const { isOpenEditModal, currentEditItem } = useAppSelector(selectEditInventoryModal);
  const dispatch = useAppDispatch();
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const openSettings = (event: any, currentItem: InventoryItem) => {
    dispatch(setCurrentEditItem(currentItem));
    setCoordinates({ x: event.nativeEvent.layerX, y: event.nativeEvent.layerY });
    setIsOpenSettings(!isOpenSettings);
  };

  const outsideClick = (value: boolean) => {
    setIsOpenSettings(value);
  };

  const handleCloseModal = () => {
    dispatch(setIsOpenEditModal(false));
  };

  const formatDate = (date: string) => {
    const split = date.split(' ');
    const operationStart = split[0] + ' | ' + split[1];
    return operationStart;
  };

  return (
    <>
      {currentEditItem && (
        <EditInventoryModal isOpen={isOpenEditModal} handleClose={handleCloseModal} />
      )}
      {currentEditItem && isOpenSettings && (
        <ReportSettings
          currentReport={currentEditItem}
          coordinates={coordinates}
          outsideClick={outsideClick}
        />
      )}
      <Cover className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Inventory Report</h4>

          {inventoryItems && inventoryItems[0] && (
            <p className={styles.date}>{formatDate(inventoryItems[0].date_created)}</p>
          )}
        </div>

        <div className={styles.content}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Current Stock</th>
                <th>Low Stock Level</th>
                <th>Camera</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          item.status === 'In stock' && styles.statusStock
                        } ${item.status === 'Low stock level' && styles.statusLowStock} ${
                          item.status === 'Out of stock' && styles.statusOutStock
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.current_stock_level}</td>
                    <td>{item.low_stock_level}</td>
                    <td>{item.camera}</td>
                    <td>
                      <Settings
                        className={styles.editIcon}
                        onClick={(e: MouseEvent) => openSettings(e, item)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cover>
    </>
  );
};
