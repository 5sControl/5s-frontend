/* eslint-disable quotes */
import moment from 'moment';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
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
import { DayPicker } from '../../../../components/dayPicker/dayPicker';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (ranges: any) => {
    dispatch(setInventoryHistoryDate(moment(ranges.selection.startDate).format('YYYY-MM-DD')));
    setVisibleModalDate(false);
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
            className={styles.buttonWhite}
          >
            {new Date(selectDate ? selectDate : currentDate).toDateString() ===
            new Date().toDateString()
              ? moment(selectDate ? selectDate : currentDate).format('MMM, DD')
              : moment(selectDate).format('MMM, DD')
              ? moment(selectDate).format('MMM, DD')
              : moment(currentDate).format('MMM, DD')}
          </button>
          {visibleModalDate && (
            <DayPicker
              handleSelect={handleSelect}
              selectDate={selectDate ? selectDate : currentDate}
              onClose={() => setVisibleModalDate(false)}
            />
          )}
        </div>

        {!isLoadingHistory &&
        inventoryHistoryData &&
        inventoryHistoryData[0] &&
        inventoryHistoryData[0].id ? (
          <Chart />
        ) : inventoryHistoryData && inventoryHistoryData.length === 0 && !isLoadingHistory ? (
          <div className={styles.noItem}>
            <h2>No data</h2>
            <p>
              There must be a problem with the camera <br></br>connection or algorithm’s work
            </p>
          </div>
        ) : (
          <Preloader />
        )}
      </div>
    </>
  );
};
