import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

const Timeline = ({ minDate, maxDate }) => {
  const svgRef = useRef(null);

  function getDuration(milli) {
    let minutes = Math.floor(milli / 60000);
    let hours = Math.round(minutes / 60);
    let days = Math.round(hours / 24);
    let size = days > 1 ? 400 : window.innerHeight - 300;
    return days * size;
  }
  const days = moment(maxDate).diff(minDate, 'days');
  const proportion = 1 - Math.abs((days * 10) / ((days + 1) * 24 - 10));
  useEffect(() => {
    const dateArray = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      dateArray.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // Определение размеров графика
    const margin = { top: 10, right: 20, bottom: 0, left: 60 };
    const width = 100 - margin.left - margin.right;
    const height = getDuration(maxDate - minDate) * proportion;
    // Создание шкалы времени для оси Y - первый диапазон
    const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + (days + 1) * 18)
      .append('g')
      .attr('transform', `translate(5,${margin.top})`);

    for (let i = 0; i < dateArray.length; i++) {
      const yScale1 = d3
        .scaleTime()
        .domain([parseTime(`${dateArray[i]}T06:00:00`), parseTime(`${dateArray[i]}T20:00:00`)])
        .range([0, height / dateArray.length]);

      // Создание оси Y для первого диапазона
      const yAxis1 = d3
        .axisRight(yScale1)
        .ticks(d3.timeHour.every(1))
        .tickFormat((date, index) => {
          if (index === 0 || index === 14) {
            return d3.timeFormat('%d.%m, %H:%M')(date);
          } else {
            return d3.timeFormat('%H:%M')(date);
          }
        });

      svg
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(0, ${i * (height / dateArray.length) + i * 18})`)
        .call(yAxis1);
    }
    // Добавление меток дней
    svg
      .selectAll('.day-label')
      .enter()
      .append('text')
      .attr('class', 'day-label')
      .attr('x', -10)
      .attr('y', 0)
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .text((d) => d.label);
    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [maxDate, minDate, proportion]);

  return <svg ref={svgRef}></svg>;
};

export default Timeline;
