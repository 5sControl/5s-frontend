/* eslint-disable quotes */
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Select } from '../../../../components/select/select';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { DataPicker } from '../../../dashboard/components/dataPicker';
import { getInventoryItemHistoryAsync, selectInventory } from '../../inventorySlice';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { StockImageModal } from '../StockImageModal';
import * as d3 from 'd3';
import {
  selectStockImageModal,
  setCurrentReportData,
  setIsOpenStockImageModal,
} from '../StockImageModal/stockImageModalSlice';
import styles from './inventoryHistory.module.scss';
import { parseExtraFuild } from '../../inventoryHelper';

export const InventoryHistory: React.FC = () => {
  const { inventoryHistoryData } = useAppSelector(selectInventory);
  const { isOpenStockImageModal, currentReportData } = useAppSelector(selectStockImageModal);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const d3Container = useRef(null);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));

  const handleOpenModel = (item: any) => {
    dispatch(setIsOpenStockImageModal(true));
    dispatch(setCurrentReportData(item));
  };

  const hangleCloseModel = () => {
    dispatch(setIsOpenStockImageModal(false));
  };

  const drawChart = (fullData: any) => {
    const data = fullData.map((item: any) => {
      return parseExtraFuild(item.extra).count;
    });

    const svg = d3.select('#d3Test').append('svg').attr('width', '100%').attr('height', 450);

    // const tooltip = d3
    //   .select('#d3Test')
    //   .append('div')
    //   .style('position', 'absolute')
    //   .style('z-index', '10')
    //   .style('visibility', 'visible')
    //   .text('Scanned vs UnScanned')
    //   .style('font', 'Arial')
    //   .style('color', 'red')
    //   .style('font-size', '14px');

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .attr('x', (d: any, i: any) => i * Math.floor(d3Container.current.clientWidth / data.length))
      .attr('y', (d: any, i: any) => 300 - 10 * d)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .attr('width', Math.floor(d3Container.current.clientWidth / data.length))
      .attr('height', (d: any, i: any) => d * 10)
      .attr('id', (d: any, i: any) => fullData[i].id)
      .attr('fill', (d: any, i: any) =>
        parseExtraFuild(fullData[i].extra).status === 'In stock'
          ? '#87BC45'
          : parseExtraFuild(fullData[i].extra).status === 'Low stock level'
          ? '#FF7B29'
          : '#E00606'
      )
      .attr('style', 'cursor: coursor-pointer')
      .on('click', (d: any, i: any) => {
        handleOpenModel(fullData.find((item: any) => item.id === +d.target.id));
      });
    // .on('mouseover', function (d) {
    //   return tooltip.text(d.type + ' - ' + d.y);
    // });
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

  useEffect(() => {
    if (inventoryHistoryData && inventoryHistoryData[0] && inventoryHistoryData[0].id) {
      drawChart(inventoryHistoryData);
    }
  }, [inventoryHistoryData]);

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
            {`${selectDate}`}
          </button>
          {visibleModalDate && (
            <DataPicker
              setSelectDate={(e: any) => setSelectDate(e)}
              setVisibleModalDate={(e: any) => setVisibleModalDate(e)}
              selectDateDash={selectDate}
            />
          )}
        </div>

        {/* {inventoryHistoryData && (
          <div className={styles.historyItems}>
            {inventoryHistoryData.map((item: any) => {
              return (
                <div className={styles.item} key={item.id} onClick={() => handleOpenModel(item)}>
                  <div>{parseExtraFuild(item.extra).count}</div>
                  <div className={styles.status}>{parseExtraFuild(item.extra).status}</div>
                </div>
              );
            })}
          </div>
        )} */}

        {inventoryHistoryData && inventoryHistoryData[0] && (
          <div ref={d3Container} id="d3Test"></div>
        )}
      </div>
    </>
  );
};
