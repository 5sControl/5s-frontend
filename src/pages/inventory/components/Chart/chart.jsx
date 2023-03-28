import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import moment from 'moment-timezone';
import './chart.scss';
import {
  setCurrentReportData,
  setIsOpenStockImageModal,
} from '../StockImageModal/stockImageModalSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';

const dimensions = {
  top: 80,
  left: 60,
  bottom: 60,
  right: 60,
};

type PropsType = {
  data: any,
  width: any,
  height: any,
};

const BarChart: React.FC<PropsType> = ({ data, width, height }) => {
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  const handleOpenModel = (item: any) => {
    dispatch(setIsOpenStockImageModal(true));
    dispatch(setCurrentReportData(item));
  };

  const timeDifference = (start, end) => {
    return (
      moment(end).diff(moment(start), 'hours') +
      'h' +
      ' ' +
      (moment(end).diff(moment(start), 'minutes') % 60) +
      'min'
    );
  };

  useEffect(() => {
    if (data) {
      const svg = d3.select('#chart');
      const update = data.map((item) => {
        return { ...item, start_tracking: new Date(Date.parse(item.start_tracking)) };
      });

      const selection = svg.selectAll('rect').data(update);
      const enter = selection.enter();

      const xScale = d3
        .scaleTime()
        .domain(
          d3.extent(update, function (d) {
            return d.start_tracking;
          })
        )
        .nice()
        .rangeRound([0, width - dimensions.left - dimensions.right]);

      const yScale = d3
        .scaleLinear()
        .domain([getMaxOfArray(update.map((item) => item.extra[0].count)) + 10, 0])
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
          g.selectAll('.tick > line')._groups[0].forEach((item) => {
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
          g.selectAll('.tick > line')._groups[0].forEach((item) => {
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
        .call(d3.axisBottom(xScale).tickFormat((date) => moment(date).format('HH:mm')))
        .attr('transform', `translate(${dimensions.left}, ${height - dimensions.bottom} )`)
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick > line')._groups[0].forEach((item) => item.remove()))
        .call((g) => g.selectAll('.tick text').attr('font-size', 12).attr('fill', '#9E9E9E'));

      const tooltip = d3
        .select('#chartBar')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute');

      const showTooltip = function (d, d1) {
        tooltip.html(
          `<div class="container"><h2 class="header">${moment(d1.start_tracking).format(
            'HH:mm'
          )} - ${moment(d1.stop_tracking).format(
            'HH:mm'
          )}&nbsp;<span class="time">${'| '}${timeDifference(
            d1.start_tracking,
            d1.stop_tracking
          )}</span></h2><div class="stock"><span class="stockNumber ${
            d1.extra[0].status === 'In stock' && 'stockIn'
          } ${d1.extra[0].status === 'Low stock level' && 'low'} ${
            d1.extra[0].status === 'Out of stock' && 'out'
          }">${d1.extra[0].count}</span> in stock</div><div class="status ${
            d1.extra[0].status === 'In stock' && 'statusStock'
          } ${d1.extra[0].status === 'Low stock level' && 'statusLowStock'} ${
            d1.extra[0].status === 'Out of stock' && 'statusOutStock'
          }">${d1.extra[0].status}</div><p class="click">Click to see details</p></div>`
        );
        tooltip
          .style('opacity', 1)
          .style('left', d.layerX - 120 + 'px')
          .style('top', d.layerY - 25 - 160 + 'px');
      };

      const hideTooltip = () => {
        tooltip.style('opacity', 0);
      };

      const bar = enter.append('g').attr('transform', (d: any, i: any) => {
        if (d) {
          return `translate(${xScale(d.start_tracking) + dimensions.left}, ${
            yScale(d.extra[0].count) + dimensions.top
          } )`;
        }
        return '';
      });

      bar
        .append('rect')
        .attr('width', 5)
        .attr(
          'height',
          (d: any) => height - yScale(d.extra[0].count) - dimensions.bottom - dimensions.top
        )
        .attr('fill', (d: any) =>
          d.extra[0].status === 'In stock'
            ? '#87BC45'
            : d.extra[0].status === 'Low stock level'
            ? '#FF7B29'
            : '#E00606'
        )
        .attr('id', (d) => d.id)
        .style('cursor', 'pointer')
        .on('mouseover', showTooltip)
        .on('mousemove', showTooltip)
        .on('mouseleave', hideTooltip)
        .on('click', (d: any, i: any) => {
          handleOpenModel(data.find((item: any) => item.id === +d.target.id));
        });

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

export function FeaturesBarChart() {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const { inventoryHistoryData } = useAppSelector(selectInventory);

  useEffect(() => {
    if (ref && ref.current) {
      const wrapper = d3.select(ref.current).node().getBoundingClientRect();
      wrapper && setSize({ width: wrapper.width, height: wrapper.height });
    }
  }, [inventoryHistoryData]);

  return (
    <div id="chartBar" ref={ref}>
      {size && <BarChart data={inventoryHistoryData} width={size.width} height={350} />}

      <div className="labels">
        <div className="label">
          <div className="label-inStock"></div>
          <p>In stock</p>
        </div>
        <div className="label">
          <div className="label-low-stock"></div>
          <p>Low stock level</p>
        </div>
        <div className="label">
          <div className="label-out-stock"></div>
          <p>Out of stock</p>
        </div>
      </div>
    </div>
  );
}
export default FeaturesBarChart;
