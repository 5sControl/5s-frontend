/* eslint-disable quotes */
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
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
import * as _ from 'lodash';
import { Radio } from '../../../../components/radio';

export const InventoryHistory: React.FC = () => {
  const { inventoryHistoryData, isLoadingHistory } = useAppSelector(selectInventory);
  const { isOpenStockImageModal, currentReportData } = useAppSelector(selectStockImageModal);
  const { selectDate } = useAppSelector(selectInventoryHistory);
  const dispatch = useAppDispatch();
  const usedAlgorithms = useMemo(() => {
    return _.uniqBy(
      inventoryHistoryData?.map((report) => report.algorithm),
      (el) => el?.id
    );
  }, [inventoryHistoryData]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<{ id: number; name: string }>(
    usedAlgorithms[0] as { id: number; name: string }
  );
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [currentDate] = useState(moment().format('YYYY-MM-DD'));

  const hangleCloseModel = () => {
    dispatch(setIsOpenStockImageModal(false));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (ranges: any) => {
    dispatch(setInventoryHistoryDate(moment(ranges.selection.startDate).format('YYYY-MM-DD')));
    setVisibleModalDate(false);
  };

  useEffect(() => {
    setSelectedAlgorithm(usedAlgorithms[0] as { id: number; name: string });
  }, [usedAlgorithms]);

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
        <div className={styles.algorithmsFilterContainer}>
          {!isLoadingHistory &&
            usedAlgorithms.map((alg) => {
              const lastReport = inventoryHistoryData
                ?.filter((el) => el.algorithm?.id === alg?.id)
                .at(-1);
              const countStatus =
                lastReport && lastReport.extra[0].count === 0
                  ? 'Out of Stock'
                  : lastReport && lastReport.extra[0].count < lastReport.extra[0].low_stock_level
                  ? 'Low Stock Level'
                  : 'In Stock';
              return (
                <div className={styles.algorithmRadioContainer} key={alg?.id}>
                  {selectedAlgorithm && (
                    <Radio
                      id={alg?.id.toString() as string}
                      name={''}
                      value={alg?.name as string}
                      label={''}
                      onChange={(e) => {
                        const algorithm = usedAlgorithms.find((i) => i?.name === e.target.value);
                        setShowChart(false);
                        setSelectedAlgorithm(algorithm!);
                        setTimeout(() => {
                          setShowChart(true);
                        }, 100);
                      }}
                      checked={selectedAlgorithm.id === alg!.id}
                    />
                  )}
                  <span>{alg!.name}: </span>
                  <span
                    className={
                      countStatus === 'In Stock'
                        ? styles.stockIn
                        : countStatus === 'Out of Stock'
                        ? styles.out
                        : styles.low
                    }
                  >
                    {countStatus}
                  </span>
                  <span>({lastReport?.extra[0].count})</span>
                </div>
              );
            })}
        </div>
        {!isLoadingHistory &&
        inventoryHistoryData &&
        inventoryHistoryData[0] &&
        showChart &&
        inventoryHistoryData[0].id ? (
          <Chart algorithm={selectedAlgorithm} />
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
