/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import styles from './barChart.module.scss';
import * as d3 from 'd3';
import moment from 'moment-timezone';
import {
  setCurrentReportData,
  setIsOpenStockImageModal,
} from '../StockImageModal/stockImageModalSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import { HistoryExtra, InventoryHistory } from '../../types';
import { getExtraOfActiveData } from '../../helper';

type PropsType = {
  data: Array<InventoryHistory> | null;
  width: number;
  height: number;
};

export const BarChart: React.FC<PropsType> = ({ data, width, height }) => {
  const dispatch = useAppDispatch();
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  const dimensions = {
    top: 80,
    left: 60,
    bottom: 60,
    right: 60,
  };

  const getMaxOfArray = (numArray: Array<number>) => {
    return Math.max.apply(null, numArray);
  };

  const handleOpenModel = (item?: InventoryHistory) => {
    dispatch(setIsOpenStockImageModal(true));
    item && dispatch(setCurrentReportData(item));
  };

  const timeDifference = (start: string, end: string) => {
    return (
      moment(end).diff(moment(start), 'hours') +
      'h' +
      ' ' +
      (moment(end).diff(moment(start), 'minutes') % 60) +
      'min'
    );
  };

  const setExtraOfActiveData = (extra: Array<HistoryExtra>) => {
    return getExtraOfActiveData(extra, activeInventoryItem);
  };

  useEffect(() => {
    if (data) {
      const svg = d3.select('#chart');
      const update = data.map((item) => {
        return { ...item, start_tracking: new Date(Date.parse(item.start_tracking)) };
      });

      const selection = svg.selectAll('rect').data(update);
      const enter = selection.enter();

      const extentValue = d3.extent(update, (d) => d.start_tracking);
      const xScale = d3
        .scaleTime()
        .domain([extentValue[0] ?? 0, extentValue[1] ?? 0])
        .nice()
        .rangeRound([0, width - dimensions.left - dimensions.right]);

      const yScale = d3
        .scaleLinear()
        .domain([
          getMaxOfArray(update.map((item) => setExtraOfActiveData(item.extra).count)) + 10,
          0,
        ])
        .range([0, height - dimensions.top - dimensions.bottom]);

      svg
        .append('g')
        .call(d3.axisLeft(yScale))
        .call((g) => g.select('.domain').remove())
        .attr('transform', `translate(${dimensions.left}, ${dimensions.top} )`)
        .call((g) =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('x2', width - dimensions.left - dimensions.right)
            .attr('stroke-opacity', 0.1)
            .attr('class', 'line-clone')
        )
        .call((g) =>
          (g.selectAll('.tick > line') as any)._groups[0].forEach((item: any) => {
            if (!item.classList.length) {
              item.remove();
            }
          })
        )
        .call((g) =>
          g.selectAll('.tick text').attr('font-size', 12).attr('fill', '#9E9E9E').attr('dy', '0em')
        );

      svg
        .append('g')
        .call(d3.axisRight(yScale))
        .call((g) => g.select('.domain').remove())
        .attr('transform', `translate(${width - dimensions.right}, ${dimensions.top} )`)
        .call((g) =>
          (g.selectAll('.tick > line') as any)._groups[0].forEach((item: any) => {
            if (!item.classList.length) {
              item.remove();
            }
          })
        )
        .call((g) =>
          g.selectAll('.tick text').attr('font-size', 12).attr('fill', '#9E9E9E').attr('dy', '0em')
        );

      svg
        .append('g')
        .call(d3.axisBottom(xScale).tickFormat((date: any) => moment(date).format('HH:mm')))
        .attr('transform', `translate(${dimensions.left}, ${height - dimensions.bottom} )`)
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          (g.selectAll('.tick > line') as any)._groups[0].forEach((item: any) => item.remove())
        )
        .call((g) => g.selectAll('.tick text').attr('font-size', 12).attr('fill', '#9E9E9E'));

      const tooltip = d3
        .select('#chartBar')
        .append('div')
        .attr('class', styles.tooltip)
        .style('opacity', 0)
        .style('position', 'absolute');

      const showTooltip = function (d: any, d1: any) {
        tooltip.html(
          `<div class="${styles.container}"><h2 class="${styles.header}">${moment(
            d1.start_tracking
          ).format('HH:mm')} - ${moment(d1.stop_tracking).format('HH:mm')}&nbsp;<span class="${
            styles.time
          }">${'| '}${timeDifference(d1.start_tracking, d1.stop_tracking)}</span></h2><div class="${
            styles.stock
          }"><span class="${styles.stockNumber} ${
            setExtraOfActiveData(d1.extra).status === 'In stock' && styles.stockIn
          } ${setExtraOfActiveData(d1.extra).status === 'Low stock level' && styles.low} ${
            setExtraOfActiveData(d1.extra).status === 'Out of stock' && styles.out
          }">${setExtraOfActiveData(d1.extra).count}</span> in stock</div>
          <div class="${styles.status} ${
            setExtraOfActiveData(d1.extra).status === 'In stock' && styles.statusStock
          } ${
            setExtraOfActiveData(d1.extra).status === 'Low stock level' && styles.statusLowStock
          } ${setExtraOfActiveData(d1.extra).status === 'Out of stock' && styles.statusOutStock}">${
            setExtraOfActiveData(d1.extra).status
          }</div>
          <p class="${styles.click}">Click to see details</p></div>`
        );

        tooltip
          .style('opacity', 1)
          .style('left', d.layerX - 120 + 'px')
          .style('top', d.layerY - 25 - 160 + 'px');
      };

      const hideTooltip = () => {
        tooltip.style('opacity', 0);
      };

      const bar = enter.append('g').attr('transform', (d) => {
        if (d) {
          return `translate(${xScale(d.start_tracking) + dimensions.left}, ${
            yScale(setExtraOfActiveData(d.extra).count) + dimensions.top
          } )`;
        }
        return '';
      });

      bar
        .append('rect')
        .attr('width', width / data.length)
        .attr(
          'height',
          (d) =>
            height -
            yScale(setExtraOfActiveData(d.extra).count) -
            dimensions.bottom -
            dimensions.top +
            8
        )
        .attr('fill', (d) =>
          setExtraOfActiveData(d.extra).status === 'In stock'
            ? '#87BC45'
            : setExtraOfActiveData(d.extra).status === 'Low stock level'
            ? '#FF7B29'
            : '#E00606'
        )
        .attr('id', (d) => d.id)
        .style('cursor', 'pointer')
        .on('mouseover', showTooltip)
        .on('mousemove', showTooltip)
        .on('mouseleave', hideTooltip)
        .on('click', (d) => {
          handleOpenModel(data.find((item: InventoryHistory) => item.id === +d.target.id));
        });

      activeInventoryItem &&
        svg
          .append('line')
          .attr('class', 'middleLine')
          .attr('stroke-dasharray', '20 20')
          .attr('stroke', '#666666')
          .attr('x1', dimensions.left)
          .attr('y1', yScale(activeInventoryItem.low_stock_level) + dimensions.top)
          .attr('x2', width - dimensions.right)
          .attr('y2', yScale(activeInventoryItem.low_stock_level) + dimensions.top);
    }
  }, []);

  return <svg id="chart" width={width} height={height}></svg>;
};
