/* eslint-disable quotes */
import moment from 'moment-timezone';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { DataPicker } from '../../../dashboard/components/dataPicker';
import { selectInventory } from '../../inventorySlice';
import { StockImageModal } from '../StockImageModal';
import {
  selectStockImageModal,
  setIsOpenStockImageModal,
} from '../StockImageModal/stockImageModalSlice';
import styles from './inventoryHistory.module.scss';
import { Preloader } from '../../../../components/preloader';
import { Chart } from '../Chart';
import { selectInventoryHistory, setInventoryHistoryDate } from './inventoryHistorySlice';

export const InventoryHistory: React.FC = () => {
  const { inventoryHistoryData, isLoadingHistory } = useAppSelector(selectInventory);
  const { isOpenStockImageModal, currentReportData } = useAppSelector(selectStockImageModal);
  const { selectDate } = useAppSelector(selectInventoryHistory);
  const dispatch = useAppDispatch();

  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [currentDate] = useState(moment().format('YYYY-MM-DD'));

  const hangleCloseModel = () => {
    dispatch(setIsOpenStockImageModal(false));
  };

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
            {new Date(selectDate ? selectDate : currentDate).toDateString() ===
            new Date().toDateString()
              ? 'Today, ' + (selectDate ? selectDate : currentDate)
              : selectDate
              ? selectDate
              : currentDate}
          </button>
          {visibleModalDate && (
            <DataPicker
              setSelectDate={(e: string) => dispatch(setInventoryHistoryDate(e))}
              setVisibleModalDate={(e: boolean) => setVisibleModalDate(e)}
              selectDateDash={selectDate ? selectDate : currentDate}
            />
          )}
        </div>

        {!isLoadingHistory &&
        inventoryHistoryData &&
        inventoryHistoryData[0] &&
        inventoryHistoryData[0].id ? (
          <Chart />
        ) : (
          <Preloader loading={isLoadingHistory} />
        )}
      </div>
    </>
  );
};
