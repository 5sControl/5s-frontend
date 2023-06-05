import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Gorilla from '../assets/gif/gorila.gif';
import Arrow from '../assets/svg/arrow.svg';
import { Operation } from './operation';
import Timeline from './scale';
import moment from 'moment';

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}

const VerticalTimeline = ({ data, minDate, maxDate, selectOrder }) => {
  const days = moment(maxDate).diff(minDate, 'days');
  const proportion = 1 - Math.abs((days * 10) / ((days + 1) * 24 - 10));
  const dateArray = [];
  const currentDate = new Date(minDate);

  while (currentDate <= maxDate) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  console.log(dateArray);
  const [update, setUpdate] = useState(data);
  useEffect(() => {
    if (data.length > 0) {
      const first = data.filter((order) =>
        JSON.stringify(order.operations).includes(`"${selectOrder}"`)
      );
      const end = data.filter(
        (order) => !JSON.stringify(order.operations).includes(`"${selectOrder}"`)
      );
      setUpdate(
        data.filter((order) => JSON.stringify(order.operations).includes(`${selectOrder}`))
      );
    }
  }, [data, selectOrder]);

  const timelineRef = useRef(null);
  const [position, setPosition] = useState(0);
  const [operation, setOperation] = useState(false);
  const fieldWidth = 150;

  const positionHandler = (e) => {
    if (position + e > 0) {
      setPosition(0);
    } else {
      if (-(position + e) < data.length) {
        setPosition(position + e);
      }
    }
  };

  const clickHandler = (e, event) => {
    console.log(e);
    fetch('https://5scontrol.pl/proxy_to_ngrok/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url:
          'https://0bc5-81-7-77-205.ngrok-free.app/api/new-order/order-detail/?operation=' + e.id,
        method: 'GET',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOperation({
          data: data,
          x: event.pageX,
          y: event.pageY,
        });
      });
  };

  useEffect(() => {
    if (timelineRef.current && update.length > 0) {
      const margin = { top: 10, right: 0, bottom: 0, left: 0 };
      const height = getDuration(maxDate - minDate);
      const width = update.length * fieldWidth;

      const svg = d3
        .select(timelineRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + days * 20)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const parseDate = (e, d) => {
        return new Date(e);
      };

      const y = d3.scaleTime().domain([minDate, maxDate]).range([0, height]);

      // Добавление серых блоков для заполнения разницы
      update.forEach((element, index) => {
        const greyBars = svg
          .selectAll('.grey-bar' + index)
          .data(() => [dateArray])
          .enter()
          .append('g')
          .attr('class', 'grey-bar' + index);

        greyBars
          .append('rect')
          .attr('x', index * fieldWidth - 1) // Ширина границы: 1px
          .attr('y', 0)
          .attr('width', 1)
          .attr('height', height)
          .attr('fill', '#C7C7C7')
          .attr('z-index', 1);

        greyBars
          .append('rect')
          .attr('x', index * fieldWidth + 35)
          .attr('y', 0)
          .attr('width', fieldWidth - 70)
          .attr('height', height)
          .on('click', () => setOperation(false))
          .attr('fill', '#CCCCCC');

        dateArray.forEach((date, ind) => {
          greyBars
            .append('rect')
            .attr('x', index * fieldWidth + 35)
            .attr('y', 0)
            .attr('width', fieldWidth - 70)
            .attr('height', 19)
            .on('click', () => setOperation(false))
            .attr('fill', '#ededed')
            .attr('transform', (d, i) => {
              console.log(i);
              return `translate(0, ${(ind + 1) * (400 * proportion) + ind * 18} )`;
            });
        });
      });

      update.forEach((element, index) => {
        const bars = svg
          .selectAll('.timeline-bar' + index)
          .data(() => element.operations)
          .enter()
          .append('g')
          .attr('class', 'timeline-bar' + index)
          .attr('transform', (d, i) => {
            const diff = moment(d.startTime).diff(minDate, 'days');
            const newDate = moment(d.startTime)
              .subtract(9 * diff, 'hours')
              .format('YYYY-MM-DD HH:mm:ss.SSSSSS');
            return `translate(0, ${y(parseDate(newDate))})`;
          })
          .on('mouseover', function () {
            d3.select(this).select('rect').attr('opacity', 1);
          })
          .on('click', function (event, d) {
            d3.select(this).select('rect').attr('opacity', 1);
            clickHandler(d, event);
          })
          .on('mouseout', function (event, d) {
            d3.select(this)
              .select('rect')
              .attr('opacity', d.orderName === selectOrder ? 1 : 0.6);
          });

        bars
          .append('rect')
          .attr('x', index * fieldWidth + 35)
          .attr('y', 0)
          .attr('width', fieldWidth - 70)
          .attr('height', (d, i) => {
            return y(parseDate(d.endTime, d)) - y(parseDate(d.startTime, d));
          })
          .attr('fill', '#87BC45')
          .attr('opacity', (d, i) => (d.orderName === selectOrder ? 1 : 0.6))
          .attr('z-index', 2);
      });
    }
    return () => {
      d3.select(timelineRef.current).selectAll('*').remove();
    };
  }, [minDate, maxDate, selectOrder, timelineRef, update, dateArray, proportion, days]);

  return (
    <div className="container">
      <div className="header">
        {update.map((element, index) => (
          <div
            key={index}
            className="text tooltip"
            style={{
              position: 'absolute',
              top: '10px',
              left: `${fieldWidth * index + 30}px`,
              width: `${fieldWidth - 60}px`,
              transform: `translateX(${position * fieldWidth}px)`,
            }}
            title={element.operationName}
          >
            {element.operationName.slice(0, 10)}
          </div>
        ))}
        <div className="prev">
          <img
            src={Arrow}
            alt=""
            width={20}
            height={20}
            className="arrow"
            onClick={() => positionHandler(1)}
          />
        </div>
        <div className="next">
          <img
            src={Arrow}
            alt=""
            width={20}
            height={20}
            className="arrow"
            onClick={() => positionHandler(-1)}
          />
        </div>
      </div>
      <div className="timelineWrapper">
        <div className="wrapper">
          {update.length === 0 && (
            <div className="gorilla">
              <img src={Gorilla} alt="" width={120} height={120} />
            </div>
          )}

          <div
            ref={timelineRef}
            style={{
              width: `${update.length * fieldWidth}px`,
              height: `${getDuration(maxDate - minDate) * proportion + (days + 1) * 20}px`,
              transform: `translateX(${position * fieldWidth}px)`,
            }}
          ></div>
        </div>
        <div className="datetime">
          <Timeline minDate={minDate} maxDate={maxDate} />
        </div>
      </div>
      {operation && (
        <Operation operation={operation.data} x={`${operation.x}px`} y={`${operation.y}px`} />
      )}
    </div>
  );
};

export default VerticalTimeline;
