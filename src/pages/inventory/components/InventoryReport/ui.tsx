import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { Settings } from '../../../../assets/svg/SVGcomponent';
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

export const InventoryReport: React.FC = () => {
  const { inventoryItems } = useAppSelector(selectInventory);
  const { isOpenEditModal, currentEditItem } = useAppSelector(selectEditInventoryModal);
  const dispatch = useAppDispatch();
  const openEditModal = (currentItem: InventoryItem) => {
    dispatch(setCurrentEditItem(currentItem));
    dispatch(setIsOpenEditModal(true));
  };

  const handleCloseModal = () => {
    dispatch(setIsOpenEditModal(false));
  };

  return (
    <>
      {currentEditItem && (
        <EditInventoryModal isOpen={isOpenEditModal} handleClose={handleCloseModal} />
      )}
      <Cover className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Inventory Report</h4>

          {inventoryItems && <p className={styles.date}>{inventoryItems[0].date_created}</p>}
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
                      <Settings className={styles.editIcon} onClick={() => openEditModal(item)} />
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
