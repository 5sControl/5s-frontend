import React, { useEffect, useState } from 'react';
import { Cover } from '../../../../components/cover';
import { Settings } from '../../../../assets/svg/SVGcomponent';
import styles from './inventoryReport.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { getInventoryItemsAsync, selectInventory } from '../../inventorySlice';
import { EditInventoryModal } from '../EditInventoryModal';
import {
  selectEditInventoryModal,
  setIsOpenEditModal,
  setCurrentEditItem,
} from '../EditInventoryModal/editInventoryModalSlice';
import { ReportSettings } from '../ReportSettings';
import { DeleteInventoryModal } from '../DeleteInventoryModal';
import {
  selectDeleteInventoryModal,
  setIsOpenDeleteModal,
} from '../DeleteInventoryModal/deleteInventoryModalSlice';
import { InventoryItem } from '../../types';
import { selectStatusSort, setStatusSort } from './InventoryReportSlice';
import { selectAddInventoryModal } from '../AddInventoryModal/addInventoryModalSlice';
import { useCookies } from 'react-cookie';
import moment from 'moment-timezone';
import { Input } from '../../../../components/input';

export const InventoryReport: React.FC = () => {
  const { inventoryItems, isLoading } = useAppSelector(selectInventory);
  const { isOpenEditModal, currentEditItem } = useAppSelector(selectEditInventoryModal);
  const { isOpenDeleteModal, currentDeleteItemId } = useAppSelector(selectDeleteInventoryModal);
  const { connectResponse } = useAppSelector(selectEditInventoryModal);
  const { connectDeleteResponse } = useAppSelector(selectDeleteInventoryModal);
  const { connectResponseDataAdd } = useAppSelector(selectAddInventoryModal);
  const { statusSort } = useAppSelector(selectStatusSort);
  const dispatch = useAppDispatch();
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [cookies] = useCookies(['token']);
  const [currentUpdateDate, setCurrentUpdateDate] = useState<string | null>(null);
  const [filterItem, setFilterItem] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openSettings = (event: any, currentItem: InventoryItem) => {
    dispatch(setCurrentEditItem(currentItem));
    setCoordinates({ x: event.nativeEvent.layerX, y: event.nativeEvent.layerY });
    setIsOpenSettings(!isOpenSettings);
  };

  const outsideClick = (value: boolean) => {
    setIsOpenSettings(value);
  };

  const handleCloseEditModal = () => {
    dispatch(setIsOpenEditModal(false));
  };

  const handleCloseDeleteModal = () => {
    dispatch(setIsOpenDeleteModal(false));
  };

  const formatDate = () => {
    const date = new Date();
    return `${moment(date).format('YYYY-MM-DD ')}| ${moment(date).format('HH:mm:ss')}`;
  };

  const handleStatusSort = () => {
    dispatch(setStatusSort(!statusSort));
  };

  useEffect(() => {
    setCurrentUpdateDate(formatDate());
    dispatch(
      getInventoryItemsAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        isSort: statusSort,
      })
    );
  }, [connectResponse, connectResponseDataAdd, connectDeleteResponse, statusSort]);

  console.log(inventoryItems);
  return (
    <>
      {currentEditItem && (
        <EditInventoryModal isOpen={isOpenEditModal} handleClose={handleCloseEditModal} />
      )}
      {currentDeleteItemId && (
        <DeleteInventoryModal
          isOpen={isOpenDeleteModal}
          handleClose={handleCloseDeleteModal}
          id={currentDeleteItemId}
        />
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
          <div className={styles.title_left}>
            <Input
              type={'text'}
              id={'1'}
              name={'filter item'}
              value={filterItem}
              onChange={(e) => setFilterItem(e.target.value)}
              className={styles.search}
              placeholder={'Search item'}
              showSearch={true}
            />
            <p className={styles.date}>{currentUpdateDate}</p>
          </div>
        </div>

        <div className={styles.content}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th
                  className={`${styles.statusTh} ${isLoading && styles.disableSort}`}
                  onClick={handleStatusSort}
                >
                  <span>Status</span>
                  <span
                    className={`${styles.arrowUp} ${statusSort ? styles.sortOn : styles.sortOff}`}
                  ></span>
                </th>
                <th>Current Stock</th>
                <th>Low Stock Level</th>
                <th>Camera</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems ? (
                <>
                  {inventoryItems
                    ?.filter((invItem) =>
                      invItem.name.toString().toLowerCase().includes(filterItem.toLowerCase())
                    )
                    .map((item) => {
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
                              onClick={(event: React.MouseEvent<Element, MouseEvent>) =>
                                openSettings(event, item)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </>
              ) : isLoading ? (
                <tr>
                  <th className={styles.emptyList}>Loading...</th>
                </tr>
              ) : !isLoading && !inventoryItems ? (
                <tr>
                  <th className={styles.emptyList}>No items found</th>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Cover>
    </>
  );
};
