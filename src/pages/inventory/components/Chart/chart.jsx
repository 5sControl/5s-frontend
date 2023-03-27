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

const dimensions = {
  top: 80,
  left: 60,
  bottom: 60,
  right: 60,
};

// const colors = d3.scaleOrdinal(d3.schemeCategory10);
type PropsType = {
  data: any,
  width: any,
  height: any,
};

const BarChart: React.FC<PropsType> = ({ data, width, height }) => {
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  // const { inventoryHistoryData } = useAppSelector(selectInventory);

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  const handleOpenModel = (item: any) => {
    dispatch(setIsOpenStockImageModal(true));
    dispatch(setCurrentReportData(item));
  };

  useEffect(() => {
    if (data) {
      const svg = d3.select('#chart');
      const update = data.map((item) => {
        return { ...item, start_tracking: new Date(Date.parse(item.start_tracking)) };
      });

      console.log('update', update);

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

      // const bar = enter
      // .append('rect')
      // .attr('transform', (d: any, i: any) => {
      //   if (d) {
      //     console.log('d', d);
      //     return `translate(${xScale(d.time) + dimensions.left}, ${
      //       yScale(d.count) + dimensions.top
      //     } )`;
      //   }
      //   return '';
      // })
      // .attr('width', 10)
      // .attr('height', (d: any) => height - yScale(d.count) - dimensions.bottom - dimensions.top)
      // .attr('fill', (d: any) =>
      //   d.count === 44 ? '#87BC45' : d.count === 7 ? '#FF7B29' : '#E00606'
      // );

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
        .call(d3.axisBottom(xScale).tickFormat((date) => moment(date).format('HH:mm')))
        .attr('transform', `translate(${dimensions.left}, ${height - dimensions.bottom} )`)
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick > line')._groups[0].forEach((item) => item.remove()))
        .call((g) => g.selectAll('.tick text').attr('font-size', 12).attr('fill', '#9E9E9E'));

      const tooltip1 = d3
        .select('#test')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute');

      const showTooltip = function (d) {
        tooltip1
          .style('opacity', 1)
          .style('left', d.x - 120 + 'px')
          .style('top', d.y - 25 - 160 + 'px');
      };
      const moveTooltip = function (d, d1) {
        console.log('d1', d1);
        tooltip1.html(
          `<div class="container"><h2 class="header">${moment(d1.start_tracking).format(
            'HH:mm'
          )} - ${moment(d1.stop_tracking).format(
            'HH:mm'
          )}${' |'} <span class="time">00:00</span></h2><div class="stock"><span class="stockNumber ${
            d1.extra[0].status === 'In stock' && 'stockIn'
          } ${d1.extra[0].status === 'Low stock level' && 'low'} ${
            d1.extra[0].status === 'Out of stock' && 'out'
          }">${d1.extra[0].count}</span> in stock</div><div class="status ${
            d1.extra[0].status === 'In stock' && 'statusStock'
          } ${d1.extra[0].status === 'Low stock level' && 'statusLowStock'} ${
            d1.extra[0].status === 'Out of stock' && 'statusOutStock'
          }">${d1.extra[0].status}</div><p class="click">Click to see details</p></div>`
        );
        tooltip1.style('left', d.x - 120 + 'px').style('top', d.y - 25 - 160 + 'px');
      };
      const hideTooltip = function (d) {
        tooltip1.style('opacity', 0);
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
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip)
        .on('click', (d: any, i: any) => {
          handleOpenModel(data.find((item: any) => item.id === +d.target.id));
        });
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
    <div id="test" style={{ height: 500 }} ref={ref}>
      {size && <BarChart data={inventoryHistoryData} width={size.width} height={500} />}

      <div className="labels">
        <div className="label">
          <div className="label-inStock"></div>
          <div className="">In stock</div>
        </div>
        <div className="label">
          <div className="label-low-stock"></div>
          <div className="">Low stock level</div>
        </div>
        <div className="label">
          <div className="label-out-stock"></div>
          <div className="">Out of stock</div>
        </div>
      </div>
    </div>
  );
}
export default FeaturesBarChart;
