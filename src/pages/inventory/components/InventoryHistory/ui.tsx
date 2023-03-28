/* eslint-disable quotes */
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { DataPicker } from '../../../dashboard/components/dataPicker';
import { getInventoryItemHistoryAsync, selectInventory } from '../../inventorySlice';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { StockImageModal } from '../StockImageModal';
import {
  selectStockImageModal,
  setIsOpenStockImageModal,
} from '../StockImageModal/stockImageModalSlice';
import styles from './inventoryHistory.module.scss';
import FeaturesBarChart from '../Chart/chart';
import { Preloader } from '../../../../components/preloader';

export const InventoryHistory: React.FC = () => {
  const { inventoryHistoryData, isLoadingHistory } = useAppSelector(selectInventory);
  const { isOpenStockImageModal, currentReportData } = useAppSelector(selectStockImageModal);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));

  const hangleCloseModel = () => {
    dispatch(setIsOpenStockImageModal(false));
  };

  useEffect(() => {
    if (activeInventoryItem) {
      dispatch(
        getInventoryItemHistoryAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          params: { camera: activeInventoryItem.camera, date: selectDate },
        })
      );
    }
  }, [selectDate]);

  return (
    <>
      {currentReportData && (
        <StockImageModal
          isOpen={isOpenStockImageModal}
          handleClose={hangleCloseModel}
          currentReport={currentReportData}
        />
      )}
      <div className={styles.container}>
        <div className={styles.history}>
          <h6 className={styles.history_title}>Stock history</h6>
          <button
            onClick={() => setVisibleModalDate(!visibleModalDate)}
            className="dashboard__title_button"
          >
            {new Date(selectDate).toDateString() === new Date().toDateString()
              ? 'Today, ' + selectDate
              : selectDate}
          </button>
          {visibleModalDate && (
            <DataPicker
              setSelectDate={(e: any) => setSelectDate(e)}
              setVisibleModalDate={(e: any) => setVisibleModalDate(e)}
              selectDateDash={selectDate}
            />
          )}
        </div>

        {!isLoadingHistory &&
        inventoryHistoryData &&
        inventoryHistoryData[0] &&
        inventoryHistoryData[0].id ? (
          <FeaturesBarChart />
        ) : (
          <Preloader loading={isLoadingHistory} />
        )}
      </div>
    </>
  );
};
