import React, { FC, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import moment from "moment";
import { TimeInterval } from "../../models/types/timeInterval";
import { OperationItem } from "../../models/interfaces/operationItem.interface";
import './TimelineChart.scss';

type TimelineChartProps = {
  startTime: string;
  selectedInterval: TimeInterval;
  showScheduled: boolean;
  data: OperationItem[];
};

const TimelineChart: FC<TimelineChartProps> = ({
    startTime,
    selectedInterval,
    showScheduled,
    data,
  }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const operationHeight = 36;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chartHeight, setChartHeight] = useState(showScheduled ? ((data.length * 2 + 10) * operationHeight) : ((data.length + 10) * operationHeight));

  useEffect(() => {
    const rangeCoeff = 2;

    d3.select(chartRef.current).selectAll("*").remove();
    const newChartHeight = showScheduled ? ((data.length * 2 + 10) * operationHeight) : ((data.length + 10) * operationHeight)
    setChartHeight(newChartHeight);

    const margin = { top: 20, right: 0, bottom: 100, left: 0 };
    const height = newChartHeight - margin.top - margin.bottom;
    const width = (windowWidth - margin.left - margin.right) * rangeCoeff;
    const initialStartDate = new Date(startTime);
    const initialEndDate = new Date(initialStartDate.getTime() + selectedInterval.milliseconds * rangeCoeff);
    const xScale = d3.scaleTime().range([0, width]).domain([initialStartDate, initialEndDate]);
    const formatUnits = selectedInterval.timeFormat.units;
    const formatFrequency = selectedInterval.timeFormat.frequency;


    const drawOperations = () => {
      svg
      .selectAll(".greyRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "greyRect")
      .attr("x", 0)
      .attr("y", (d) => (yScale(d.oprName) ?? 0) + 10)
      .attr("width", width)
      .attr("height", operationHeight)
      .attr("fill", "#C5C5C")
      .attr("opacity", 0.07);

      data.forEach((op: OperationItem) => {
        svg.selectAll(".greenRect")
          .data(op.oprs)
          .enter()
          .append("rect")
          .attr("x", d => {
            return xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) ? xScale(new Date(initialStartDate)) : xScale(new Date(d.sTime))
          })
          .attr("y", (yScale(op.oprName) ?? 0 )+ 10)
          .attr("height", operationHeight)
          .transition()
          .duration(250)
          .attr("width", d => {
            if (xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) && xScale(new Date(d.eTime)) < xScale(new Date(initialStartDate))){
              return 0;
            }
            return Math.min(xScale(new Date(d.eTime)) - xScale(new Date(d.sTime)), width - xScale(new Date(d.sTime)))
          })
          .attr("fill", "#87BC45");
    })

    svg
      .selectAll(".operationName")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => (yScale(d.oprName) ?? 0) + 5)
      .attr("fill", "black")
      .attr("font-size", "12px")
      .text((d) => d.oprName);
    }

    const drawOperationsWithScheduled = () => {
      svg
      .selectAll(".greyRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => (yScale(d.oprName) ?? 0) + 10)
      .attr("width", width)
      .attr("height", operationHeight * 2)
      .attr("fill", "#C5C5C")
      .attr("opacity", 0.07);

      data.forEach((op: OperationItem) => {
        svg.selectAll(".greenRect")
          .data(op.oprs)
          .enter()
          .append("rect")
          .attr("x", d => {
            return xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) ? xScale(new Date(initialStartDate)) : xScale(new Date(d.sTime))
          })
          .attr("y", (yScale(op.oprName) ?? 0 )+ 10)
          .attr("height", operationHeight)
          .transition()
          .duration(250)
          .attr("width", d => {
            if (xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) && xScale(new Date(d.eTime)) < xScale(new Date(initialStartDate))){
              return 0;
            }
            return Math.min(xScale(new Date(d.eTime)) - xScale(new Date(d.sTime)), width - xScale(new Date(d.sTime)))
          })
          .attr("fill", "#87BC45");

      svg
        .selectAll(".orangeRect")
        .data(op.oprs)
        .enter()
        .append("rect")
        .attr("x", d => {
          return xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) ? xScale(new Date(initialStartDate)) : xScale(new Date(d.sTime))
        })
        .attr("y", (yScale(op.oprName) ?? 0) + 10 + operationHeight)
        .attr("height", operationHeight)
        .transition()
        .duration(250)
        .attr("width", d => {
          if (xScale(new Date(d.sTime)) < xScale(new Date(initialStartDate)) && xScale(new Date(d.eTime)) < xScale(new Date(initialStartDate))){
            return 0;
          }
          return Math.min(xScale(new Date(d.sTime + d.duration_expected)) - xScale(new Date(d.sTime)), width - xScale(new Date(d.sTime)))
        })
        .attr("fill", "#FE6100")
        .attr("data-start", d => d.sTime)
        .attr("data-end", d => d.eTime);
      })

    svg
      .selectAll(".operationName")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => (yScale(d.oprName) ?? 0) + 5)
      .attr("fill", "black")
      .attr("font-size", "12px")
      .text((d) => d.oprName);
    }

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.oprName))
      .range([0, height])
      .padding(0.1);
 
    const greyLinesData = Array.from(
      { length: 20 },
      (_, i) => i
    );

    greyLinesData.forEach((index) => {
      let timeForLine = moment(startTime)
      .add(index * formatFrequency, "hours")
      .startOf("minute");
      switch (formatUnits) {
        case "minutes":
          timeForLine = moment(startTime)
          .add(index * formatFrequency, "minutes")
          .startOf("minute");
          break;
        case "hours":
          timeForLine = moment(startTime)
          .add(index * formatFrequency, "hours")
          .startOf("hour");
          break;
        case "days":
          timeForLine = moment(startTime)
          .add(index * formatFrequency, "days")
          .startOf("day");
      }

      if (
        timeForLine.isSameOrAfter(moment(startTime)) &&
        timeForLine.isSameOrBefore(
          moment(initialEndDate)
        )
      ) {
        svg
          .append("line")
          .attr("class", "greyLine")
          .attr("y1", -15)
          .attr("y2", height)
          .transition()
          .duration(250)
          .attr("x1", xScale(timeForLine.toDate()))
          .attr("x2", xScale(timeForLine.toDate()))
          .attr("stroke", "lightgrey")
          .attr("stroke-width", 1);
      }
    });

      svg
      .append("g")
      .call(
        d3
          .axisTop(xScale)
          .ticks(
            formatUnits === 'minutes' ? d3.timeMinute.every(formatFrequency) 
         : formatUnits === 'hours' ? d3.timeHour.every(formatFrequency) : d3.timeDay.every(formatFrequency)
          )
          .tickFormat((date: any) => {
                    if (formatUnits === 'minutes') {
                        return d3.timeFormat('%H:%M')(date);
                    } else if (formatUnits === 'hours') {
                        return d3.timeFormat('%H:%M')(date);
                    } else if (formatUnits === 'days') {
                        return d3.timeFormat('%b %d')(date);
                    }
                    return d3.timeFormat('%H:%M')(date);
                }))
      .selectAll("text")
      .attr("fill", "grey")
      .attr("transform", "translate(15, 0)")

    svg.select(".domain").remove();
    svg.selectAll(".tick line").attr("stroke", "transparent");

  if (showScheduled){
    drawOperationsWithScheduled();
  }
  else {
    drawOperations();
  }

  if (chartContainerRef.current) {
    chartContainerRef.current.style.overflowX = width > windowWidth ? 'scroll' : 'hidden';
    chartContainerRef.current.style.width = `${windowWidth}px`;
  }
}, [selectedInterval, startTime, showScheduled, windowWidth]);

  return (
    <div className="ion-padding chartContainer">
    <div ref={chartContainerRef} className="chartWrapper">
      <svg ref={chartRef}></svg>
    </div>
    </div>
  );
};

export default TimelineChart;