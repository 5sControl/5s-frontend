import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Arrow from '../assets/svg/arrow.svg';
import { Operation } from './operation';
import Timeline from './scale';
import moment from 'moment';
import { Preloader } from '../../../components/preloader';
import { OrderOperationDetail } from '../../../components/orderOperationDetail/orderOperationDetail';
import { Notification } from '../../../components/notification/notification';
import styles from './verticalTimeline.module.scss';
import { getOrderViewOperation } from '../../../api/orderView';

function getDuration(milli) {
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);
  return days * 400;
}

const VerticalTimeline = ({ data, minDate, maxDate, selectOrder, preloader }) => {
  const [update, setUpdate] = useState(data);
  const [operationOV, setOperationOV] = useState(false);

  const days = moment(maxDate).diff(minDate, 'days');
  const proportion = 1 - Math.abs((days * 10) / ((days + 1) * 24 - 10));
  const dateArray = [];
  const currentDate = new Date(minDate);

  while (currentDate <= maxDate) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  useEffect(() => {
    if (operationOV && typeof operationOV === 'string') {
      setTimeout(() => setOperationOV(false), 2000);
    }
  }, [operationOV]);

  useEffect(() => {
    if (data.length > 0) {
      const first = data.filter((order) => JSON.stringify(order.oprs).includes(`"${selectOrder}"`));
      const end = data.filter((order) => !JSON.stringify(order.oprs).includes(`"${selectOrder}"`));
      setUpdate([...first, ...end]);
    }
  }, [data, selectOrder]);

  console.log(update);
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
    getOrderViewOperation(window.location.hostname, '', e.id).then((response) => {
      setOperation({
        data: response.data,
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
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const parseDate = (e, d) => {
        return new Date(e);
      };

      const y = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([0, height + days * 2]);

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
            .attr('fill', '#f5f5f5')
            .attr('transform', (d, i) => {
              return `translate(0, ${(ind + 1) * (400 * proportion) + ind * 18} )`;
            });
        });
      });

      update.forEach((element, index) => {
        const bars = svg
          .selectAll('.timeline-bar' + index)
          .data(() => element.oprs)
          .enter()
          .append('g')
          .attr('class', 'timeline-bar' + index)
          .attr('transform', (d, i) => {
            const diff = moment(d.sTime).diff(minDate, 'days');
            const newDate = moment(d.sTime)
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
              .attr('opacity', d.orId === selectOrder ? 1 : 0.6);
          });

        bars
          .append('rect')
          .attr('x', index * fieldWidth + 35)
          .attr('y', 0)
          .attr('width', fieldWidth - 70)
          .attr('height', (d, i) => {
            return y(parseDate(d.eTime, d)) - y(parseDate(d.sTime, d));
          })
          .attr('fill', '#87BC45')
          .attr('opacity', (d, i) => (d.orId === selectOrder ? 1 : 0.6))
          .attr('z-index', 2);
      });
    }
    return () => {
      d3.select(timelineRef.current).selectAll('*').remove();
    };
  }, [minDate, maxDate, selectOrder, timelineRef, update, dateArray, proportion, days]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {update.map((element, index) => (
          <div
            key={index}
            className={`${styles.text} ${styles.tooltip}`}
            style={{
              position: 'absolute',
              top: '10px',
              left: `${fieldWidth * index + 30}px`,
              width: `${fieldWidth - 60}px`,
              transform: `translateX(${position * fieldWidth}px)`,
            }}
            title={element.oprName}
          >
            {element.oprName.slice(0, 10)}
          </div>
        ))}
        <div className={styles.prev}>
          <img
            src={Arrow}
            alt=""
            width={20}
            height={20}
            className={styles.arrow}
            onClick={() => positionHandler(1)}
          />
        </div>
        <div className={styles.next}>
          <img
            src={Arrow}
            alt=""
            width={20}
            height={20}
            className={styles.arrow}
            onClick={() => positionHandler(-1)}
          />
        </div>
      </div>
      <div className={styles.timelineWrapper}>
        <div className={styles.wrapper}>
          {preloader ? (
            <div className={styles.gorilla}>
              <Preloader />
            </div>
          ) : (
            <>
              {update.length > 0 ? (
                <div
                  ref={timelineRef}
                  style={{
                    width: `${update.length * fieldWidth}px`,
                    height: `${getDuration(maxDate - minDate) * proportion + (days + 1) * 20}px`,
                    transform: `translateX(${position * fieldWidth}px)`,
                  }}
                ></div>
              ) : (
                <div
                  className={styles.noData}
                >{`No operations were found in the range from ${moment(minDate).format(
                  'DD.MM.YYYY'
                )} to ${moment(maxDate).format('DD.MM.YYYY')}`}</div>
              )}
            </>
          )}
        </div>
        {!preloader && (
          <div className={styles.datetime}>
            <Timeline minDate={minDate} maxDate={maxDate} />
          </div>
        )}
      </div>
      {operation && (
        <Operation
          operation={operation.data}
          x={`${operation.x}px`}
          y={`${operation.y}px`}
          onClose={() => setOperation(false)}
          setOperationOV={(e) => setOperationOV(e)}
        />
      )}
      {operationOV && typeof operationOV === 'object' && (
        <OrderOperationDetail
          operationData={operationOV}
          handleClose={() => setOperationOV(false)}
        />
      )}

      {operationOV && typeof operationOV === 'string' && (
        <Notification status={false} message={operationOV} />
      )}
    </div>
  );
};

export default VerticalTimeline;
