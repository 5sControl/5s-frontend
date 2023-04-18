import React, { Fragment, useEffect, useState } from 'react';
import { Cover } from '../../../../components/cover';
import { ArrowDown, Dots, SortSVG } from '../../../../assets/svg/SVGcomponent';
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
import {
  addActiveInventoryItem,
  selectActiveInventoryItem,
} from '../InventoryItemsList/InventoryItemsListSlice';
import { InventoryCard } from '../InventoryCard';

export const InventoryReport: React.FC = () => {
  const { inventoryItems, isLoading, camerasData } = useAppSelector(selectInventory);
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
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openSettings = (event: any, currentItem: InventoryItem) => {
    dispatch(setCurrentEditItem(currentItem));
    setCoordinates({ x: event.nativeEvent.layerX, y: event.nativeEvent.layerY });
    setIsOpenSettings(!isOpenSettings);
  };
  console.log(camerasData);
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

  const onclickHandler = (activeItem: InventoryItem) => {
    if (!activeInventoryItem || activeItem.id !== activeInventoryItem.id || !isOpen) {
      dispatch(addActiveInventoryItem(activeItem));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

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
          <table cellSpacing="0" cellPadding="0">
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.item}>Item</th>
                <th onClick={handleStatusSort}>
                  <span>Status</span>
                  <SortSVG className={statusSort ? styles.sortOn : styles.sortOff} />
                </th>
                <th className={styles.stock}>Current Stock</th>
                <th className={styles.low}>Low Stock Level</th>
                <th className={styles.camera}>Camera</th>
                <th className={styles.settings}></th>
                <th className={styles.show}></th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems ? (
                <>
                  {console.log(inventoryItems)}
                  {inventoryItems
                    ?.filter((invItem) =>
                      invItem.name.toString().toLowerCase().includes(filterItem.toLowerCase())
                    )
                    .map((item) => {
                      return (
                        <Fragment key={item.id}>
                          <tr className={styles.itemLine}>
                            <td onClick={() => onclickHandler(item)} className={styles.item}>
                              {item.name}
                            </td>
                            <td onClick={() => onclickHandler(item)}>
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
                            <td onClick={() => onclickHandler(item)} className={styles.stock}>
                              {item.current_stock_level}
                            </td>
                            <td onClick={() => onclickHandler(item)} className={styles.low}>
                              {item.low_stock_level}
                            </td>
                            <td onClick={() => onclickHandler(item)} className={styles.camera}>
                              {camerasData !== undefined &&
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                camerasData?.filter((camera: any) => camera?.id === item?.camera)[0]
                                  .text}
                            </td>
                            <td
                              className={styles.settings}
                              onClick={(event: React.MouseEvent<Element, MouseEvent>) =>
                                openSettings(event, item)
                              }
                            >
                              <Dots className={styles.editIcon} />
                            </td>
                            <td onClick={() => onclickHandler(item)} className={styles.show}>
                              <ArrowDown
                                color="var(--LowEmphasis)"
                                className={
                                  isOpen &&
                                  activeInventoryItem &&
                                  activeInventoryItem.id === item.id
                                    ? styles.top
                                    : styles.down
                                }
                              />
                            </td>
                          </tr>
                          <tr className={styles.history}>
                            <td colSpan={7}>
                              {isOpen &&
                                activeInventoryItem &&
                                activeInventoryItem.id === item.id && (
                                  <InventoryCard data={activeInventoryItem} />
                                )}
                            </td>
                          </tr>
                        </Fragment>
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
