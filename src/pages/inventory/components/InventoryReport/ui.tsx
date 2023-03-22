import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { Settings } from '../../../../assets/svg/SVGcomponent';
import styles from './inventoryReport.module.scss';
import { useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { EditInventoryModal } from '../EditInventoryModal';

export const InventoryReport: React.FC = () => {
  const { inventoryItems } = useAppSelector(selectInventory);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openEditModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <EditInventoryModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      <Cover className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Inventory Report</h4>

          <p className={styles.date}>03.02.2023 | 13:00:04</p>
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
                      <Settings className={styles.editIcon} onClick={openEditModal} />
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
