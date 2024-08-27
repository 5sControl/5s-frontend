import { useEffect, useState } from 'react';
import moment from 'moment';
import { getOrderViewOperation } from '../../../../api/orderView';
import { calculateTime } from '../../../../functions/calculateTimeDuration';
import ImageSlider from '../../../../components/slider/slider';
import { ZoomOut } from '../../../../components/zoomOut';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import {
  CrossWhite,
  SliderArrow,
  ViolintationFalse,
  ViolintationTrue,
} from '../../../../assets/svg/SVGcomponent.ts';
import { OrderOperationDetail } from '../../../../components/orderOperationDetail/orderOperationDetail';
import { Modal } from '../../../../components/modal';
import { Notification } from '../../../../components/notification/notification';
import { Scale } from '../../../../components/scale';
import styles from './timeline.module.scss';
import { getVideo } from '../../../../api/cameraRequest';

export const Timeline = ({ data, startDate, algorithm, startTime, endTime }) => {
  const [timeLine, setTimeLine] = useState([]);
  const [currentReport, setCurrentReport] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [hoverItem, setHoverItem] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [operationOV, setOperationOV] = useState(false);
  const [fullImage, setFullImage] = useState(false);

  const duration = (start, end) => {
    return (moment(end).diff(moment(start), 'seconds') / calculateTime(startTime, endTime)) * 100;
  };

  useEffect(() => {
    setCurrentCount(0);
    if (currentReport) {
      const arrowKey = (e) => {
        if (data && data?.indexOf(currentReport) > 0 && e.key === 'ArrowLeft') {
          setCurrentReport(data[data.indexOf(currentReport) - 1]);
        }
        if (data && data?.indexOf(currentReport) < data.length - 1 && e.key === 'ArrowRight') {
          setCurrentReport(data[data.indexOf(currentReport) + 1]);
        }
      };
      document.body.addEventListener('keydown', arrowKey);
      return () => {
        document.body.removeEventListener('keydown', arrowKey);
      };
    }
  }, [currentReport]);

  const operationClickHandler = (element) => {
    const body = {
      camera_ip: element.camera.id,
      time: new Date(element.start_tracking).valueOf(),
    };
    getOrderViewOperation(window.location.hostname, '', element.extra[0].skany_index).then(
      (res) => {
        if (Object.keys(res.data).length) {
          let value = {
            orId: res.data.orId,
            frsName: res.data.frsName,
            lstName: res.data.lstName,
            elType: res.data.elType,
            cameraIP: element.camera.id,
            cameraName: element.camera.name,
            algorithm: element.algorithm.name,
          };

          getVideo(window.location.hostname, body).then((res) => {
            if (Object.keys(res.data).length) {
              value = {
                ...value,
                sTime: new Date(element.start_tracking).valueOf(),
                eTime: new Date(element.stop_tracking).valueOf(),
                video: res.data,
              };
              setOperationOV(value);
            } else {
              setOperationOV(`Operation #${element.id} was not found in the database`);
            }
          });
        } else {
          setOperationOV(`Operation #${element.id} was not found in the database`);
        }
      }
    );
  };

  const videoClickHandler = (element) => {
    const body = {
      camera_ip: element.camera.id,
      time: new Date(element.start_tracking).valueOf(),
    };
    // console.log(body);
    getVideo(window.location.hostname, body).then((res) => {
      if (Object.keys(res.data).length) {
        const value = {
          cameraIP: element.camera.id,
          cameraName: element.camera.name,
          algorithm: element.algorithm.name,
          sTime: new Date(element.start_tracking).valueOf(),
          eTime: new Date(element.stop_tracking).valueOf(),
          video: res.data,
        };
        // console.log(value);
        setOperationOV(value);
      } else {
        setOperationOV(`Operation #${element.id} was not found in the database`);
      }
    });
  };

  const timeDuration = (start, end) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${days ? days + 'days' : ''} ${hours ? hours + 'h' : ''} ${minutes ? minutes + 'min' : ''
      } ${seconds ? seconds + 'sec' : ''}`;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      let bufdata = data.reverse().map((dat) => {
        return {
          id: dat.id,
          start: moment(dat.start_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment
              .utc(dat.start_tracking)
              .utcOffset(moment().utcOffset())
              .format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(dat.stop_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment
              .utc(dat.stop_tracking)
              .utcOffset(moment().utcOffset())
              .format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: dat.violation_found ? 'red' : 'green',
          algorithm: parsingAlgorithmName(dat.algorithm.name),
        };
      });

      bufdata.unshift({
        id: 0,
        start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        violation_found: 'grey',
      });

      if (moment(startDate).isSame(moment(new Date()), 'day')) {
        if (new Date(`${startDate + ' ' + endTime}`) > new Date()) {
          bufdata.push({
            id: 0,
            start: moment().format('YYYY-MM-DD HH:mm:ss'),
            stop: moment().format('YYYY-MM-DD HH:mm:ss'),
            violation_found: 'yellow',
          });
        } else {
          bufdata.push({
            id: 0,
            start: moment().format(`YYYY-MM-DD ${endTime}`),
            stop: moment().format(`YYYY-MM-DD ${endTime}`),
            violation_found: 'yellow',
          });
        }
      } else {
        bufdata.push({
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        });
      }
      setTimeLine(bufdata);
    } else {
      setTimeLine([
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          violation_found: 'grey',
        },
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        },
      ]);
    }
  }, [data]);

  const onMove = (item, event) => {
    setHoverItem(item);
    setHoverPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };
  return (
    <>
      {
        <section className={styles.timeline}>
          <span className={styles.timeline__text}> {parsingAlgorithmName(algorithm)}</span>
          <div className={styles.line}>
            {timeLine.map((el, index, array) => (
              <span
                key={index}
                onMouseOver={(e) => onMove(el, e)}
                onMouseMove={(e) => onMove(el, e)}
                onMouseLeave={() => setHoverItem(false)}
                onClick={() =>
                  el.id !== 0
                    ? setCurrentReport(data.filter((item) => item.id === el.id)[0])
                    : undefined
                }
                className={styles[el.violation_found]}
                style={{
                  width: `${el.violation_found !== 'yellow' ? duration(el.start, el.stop) : 0}%`,
                  marginLeft: `${index === 0 ? '0px' : duration(array[index - 1].stop, el.start)}%`,
                }}
              ></span>
            ))}
          </div>
        </section>
      }
      {hoverItem && (
        <div
          className={styles.hover}
          style={{ top: hoverPosition.y - 120, left: hoverPosition.x - 90 }}
        >
          <h6>{hoverItem.algorithm}</h6>
          <div className={styles.hover__time}>
            {`${moment(hoverItem.start).format('HH:mm')} - ${moment(hoverItem.stop).format(
              'HH:mm'
            )}`}

            <span>{` | ${timeDuration(hoverItem.start, hoverItem.stop)}`}</span>
          </div>
          {hoverItem.violation_found !== 'green' ? <ViolintationFalse /> : <ViolintationTrue />}
        </div>
      )}
      {currentReport && !operationOV && (
        <Modal
          className={styles.fullscreen}
          handleClose={() => setCurrentReport(false)}
          isOpen={true}
          noESC={operationOV || fullImage}
        >
          <div className={styles.fullscreen__container}>
            {data && data?.indexOf(currentReport) > 0 && (
              <SliderArrow
                className={styles.arrowLeft}
                onClick={() => setCurrentReport(data[data.indexOf(currentReport) - 1])}
              />
            )}
            {data && data?.indexOf(currentReport) < data.length - 1 && (
              <SliderArrow
                className={styles.arrowRight}
                onClick={() => setCurrentReport(data[data.indexOf(currentReport) + 1])}
              />
            )}
            <div className={styles.fullscreen__image}>
              <ImageSlider
                images={currentReport.photos}
                currentCount={currentCount}
                setCurrentCount={(e) => setCurrentCount(e)}
                isKeyDisable={true}
              />
              <Scale onClick={() => setFullImage(true)} className={styles.scale} />
            </div>
            <footer className={styles.fullscreen__footer}>
              <div className={styles.fullscreen__footer_up}>
                <span className={styles.fullscreen__footer_time}>
                  {moment
                    .utc(currentReport.start_tracking)
                    .utcOffset(moment().utcOffset())
                    .format('MMM DD')}
                  ,
                  {moment
                    .utc(currentReport.start_tracking)
                    .utcOffset(moment().utcOffset())
                    .format(' HH:mm:ss')}
                  -
                  {moment
                    .utc(currentReport.stop_tracking)
                    .utcOffset(moment().utcOffset())
                    .format('HH:mm:ss')}
                </span>
                {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
              </div>
              <div className={styles.fullscreen__footer_text}>
                <span>
                  Duration:&nbsp;
                  {timeDuration(currentReport.start_tracking, currentReport.stop_tracking)}
                </span>
              </div>
              <div className={styles.fullscreen__footer_text}>
                <span>Camera:&nbsp;</span>
                {currentReport.camera ? currentReport.camera.name : 'Deleted Camera'}
              </div>
              <div className={styles.fullscreen__footer_text}>
                <span>Algorithm:&nbsp;</span>
                {parsingAlgorithmName(currentReport.algorithm.name)}
              </div>

              {currentReport.extra && currentReport.extra.length > 0 ? (
                <div className={styles.fullscreen__footer_text}>
                  <span> Additional:&nbsp;</span>
                  <span
                    className={styles.link}
                    onClick={() => operationClickHandler(currentReport)}
                  >
                    Open order operation details
                  </span>
                </div>
              ) : (
                <div className={styles.fullscreen__footer_text}>
                  <span> Additional:&nbsp;</span>
                  <span className={styles.link} onClick={() => videoClickHandler(currentReport)}>
                    Open video
                  </span>
                </div>
              )}
            </footer>
            <div className={styles.fullscreen__close} onClick={() => setCurrentReport(false)}>
              <CrossWhite />
            </div>
          </div>
        </Modal>
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
      {fullImage && (
        <Modal isOpen={true} handleClose={() => setFullImage(false)} className={styles.fullImage}>
          <div className={styles.fullImage__container}>
            <ImageSlider
              images={currentReport.photos}
              setCurrentCount={(num) => setCurrentCount(num)}
              currentCount={currentCount}
            />
            <ZoomOut className={styles.fullImage__scale} onClick={() => setFullImage(false)} />
          </div>
        </Modal>
      )}
    </>
  );
};
