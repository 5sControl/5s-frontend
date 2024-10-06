import React, { FC, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { TimeInterval } from '../../models/types/timeInterval';

type TimelineChartProps = {
  startTime: string;
  selectedInterval: TimeInterval;
};

export const TimelineChart: FC<TimelineChartProps> = ({ startTime, selectedInterval }) => {
    console.log('startTime', startTime);
  const chartRef = useRef<SVGSVGElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const chartHeight = 500;
  const operationHeight = 36;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    d3.select(chartRef.current).selectAll('*').remove();
    const displayedHours = parseInt(selectedInterval.slice(0, -1)); 
    const data = [
      { category: 'Category 1', label: 'Label 1', start: 1727938837000, end: 1727938859000 },
      { category: 'Category 2', label: 'Label 1', start: 1727938837000, end: 1727938859000 },
      { category: 'Category 3', label: 'Label 1', start: 1727938837000, end: 1727938859000 },
      { category: 'Category 4', label: 'Label 1', start: 1727938837000, end: 1727938859000 },
      { category: 'Category 5', label: 'Label 1', start: 1727938837000, end: 1727938859000 },
    ];

    const margin = { top: 20, right: 30, bottom: 30, left: 20 };
    const width = windowWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .attr('width', windowWidth)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const intervalMapping: { [key: string]: number } = {
      '1h': 10,
      '4h': 60,
      '8h': 120,
      '12h': 240,
      '24h': 480,
    };

    const xScale = d3.scaleTime()
      .domain([new Date(startTime), new Date(moment(startTime).add(displayedHours, 'hours').format('YYYY-MM-DDTHH:mm:ss'))])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height])
      .padding(0.1);

    const greyLinesData = Array.from({ length: displayedHours * 60 / intervalMapping[selectedInterval] + 1 }, (_, i) => i);

    greyLinesData.forEach((index) => {
        const minute = index * intervalMapping[selectedInterval];
        let timeForLine = moment(startTime).add(minute, 'minutes').startOf('hour');
    
        if (selectedInterval === '1h') {
            timeForLine = moment(startTime).startOf('hour').add(minute, 'minutes');
        } 

        if (timeForLine.isSameOrAfter(moment(startTime)) && timeForLine.isSameOrBefore(moment(startTime).add(displayedHours, 'hours'))) {
            svg.append('line')
                .attr('x1', xScale(timeForLine.toDate()))
                .attr('x2', xScale(timeForLine.toDate()))
                .attr('y1', -15)
                .attr('y2', height)
                .attr('stroke', 'lightgrey')
                .attr('stroke-width', 1);
        }
    });

    svg.append('g')
      .call(d3.axisTop(xScale).ticks(
        selectedInterval === '1h' 
        ? d3.timeMinute.every(intervalMapping[selectedInterval])
        : d3.timeHour.every(intervalMapping[selectedInterval] / 60))
        .tickFormat((date: any) => moment(date).format('HH:mm')))
      .selectAll('text')
      .attr('fill', 'grey')
      .attr('transform', 'translate(15, 0)');

    svg.select('.domain').remove();

    svg.selectAll('.tick line').attr('stroke', 'transparent');
  
    svg.selectAll('.greyRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => (yScale(d.category) ?? 0) + 10)
      .attr('width', width)
      .attr('height', operationHeight)
      .attr('fill', '#C5C5C')
      .attr('opacity', 0.07);
  
      svg.selectAll('.greenRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => (yScale(d.category) ?? 0) + 10)
      .attr('width', d => xScale(new Date(d.end)) - xScale(new Date(d.start)))
      .attr('height', operationHeight)
      .attr('fill', '#87BC45');
  
      svg.selectAll('.operationName')
      .data(data)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', d => (yScale(d.category) ?? 0) + 5)
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .text(d => d.category);
  }, [selectedInterval, startTime, windowWidth]);

  return <svg ref={chartRef}></svg>;
};

export default TimelineChart;