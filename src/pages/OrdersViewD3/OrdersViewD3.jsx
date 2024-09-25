import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
import styles from './style.module.scss';
import { selectOrdersList } from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppSelector } from '../../store/hooks';
import moment from 'moment';
import {
  getFiltrationData,
  getOrderViewOperations,
  patchFiltrationData,
} from '../../api/orderView';
import { useCookies } from 'react-cookie';
import { getSelectedZone } from '../../api/cameraRequest';
import { Modal } from '../../components/modal';
import { Cross } from '../../assets/svg/SVGcomponent';
import { Button } from '../../components/button';
import { Checkbox } from '../../components/checkbox';
import { SelectConnection } from './components/selectConnection';
import { SelectParam } from './components/selectParam';
import { TimePicker } from '../../components/timePicker/timePicker';

export const TimelineComponent = ({ setIsOpenFilter, isOpenFilter }) => {
  const { filterDateData } = useAppSelector(selectOrdersList);
  const [selectOrder, setSelectOrder] = useState('');
  const [data, setData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [cookies] = useCookies(['token']);
  const [workPlaceList, setWorkPlaceList] = useState([]);
  const [changeConnectionHandler, setChangeConnectionHandler] = useState(false);
  const [zoomParam, setZoomParam] = useState(1);
  const [minDateTime, setMinDateTime] = useState('06:00');
  const [maxDateTime, setMaxDateTime] = useState('20:00');
  const minTimeIntervals = {
    1: {
      minTimeRange: 4,
      timeUnits: 'hours',
    },
    2: {
      minTimeRange: 2,
      timeUnits: 'hours',
    },
    4: {
      minTimeRange: 1,
      timeUnits: 'hours',
    },
    8: {
      minTimeRange: 30,
      timeUnits: 'minutes',
    },
    16: {
      minTimeRange: 15,
      timeUnits: 'minutes',
    },
    32: {
      minTimeRange: 8,
      timeUnits: 'minutes',
    },
  };

  const changeHandler = (index) => {
    const workplaces = workPlaceList;
    workplaces[index] = {
      ...workplaces[index],
      is_active: !workplaces[index].is_active,
    };
    setWorkPlaceList([...workplaces]);
  };

  const resetHandler = () => {
    const workplaces = workPlaceList.map((el) => {
      return {
        ...el,
        is_active: true,
      };
    });
    setWorkPlaceList([...workplaces]);
  };

  const submitHandler = () => {
    patchFiltrationData(window.location.hostname, cookies.token, workPlaceList)
      .then((response) => {
        setIsOpenFilter();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setStartDate(moment(filterDateData.from).format('YYYY-MM-DD'));
    setEndDate(moment(filterDateData.to).format('YYYY-MM-DD'));
  }, [filterDateData]);

  useEffect(() => {
    getFiltrationData(window.location.hostname, cookies.token)
      .then((res) => {
        // const response = res.data;
        const response = [
          {
            'operation_type_id': 40,
            'name': 'Asset: Coffee Grinder(8). Template: Bean Preparation(18).Step: Grinding(Step2)',
            'is_active': false
          },
          {
            'operation_type_id': 41,
            'name': 'Asset: Coffee Grinder(8). Template: Bean Preparation(18).Step: Tampering(Step3)',
            'is_active': false
          },
          {
            'operation_type_id': 37,
            'name': 'Asset: Coffee Machine(7). Template: Beverage Preparation(17).Step: Brewing Coffee(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 38,
            'name': 'Asset: Coffee Machine(7). Template: Beverage Preparation(17).Step: Quality Control(Step2)',
            'is_active': false
          },
          {
            'operation_type_id': 39,
            'name': 'Asset: Coffee Grinder(8). Template: Bean Preparation(18).Step: Weighing(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 39,
            'name': 'Asset:  Coffee Machine(7). Template: Bean Preparation(18).Step: Weighing(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 40,
            'name': 'Asset:  Coffee Machine(7). Template: Bean Preparation(18).Step: Grinding(Step2)',
            'is_active': false
          },
          {
            'operation_type_id': 41,
            'name': 'Asset:  Coffee Machine(7). Template: Bean Preparation(18).Step: Tampering(Step3)',
            'is_active': false
          },
          {
            'operation_type_id': 37,
            'name': 'Asset:  Coffee Machine(7). Template: Beverage Preparation(17).Step: Brewing Coffee(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 38,
            'name': 'Asset:  Coffee Machine(7). Template: Beverage Preparation(17).Step: Quality Control(Step2)',
            'is_active': false
          },
          {
            'operation_type_id': 39,
            'name': 'Asset:  Coffee Grinder(8). Template: Bean Preparation(18).Step: Weighing(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 40,
            'name': 'Asset:  Coffee Grinder(8). Template: Bean Preparation(18).Step: Grinding(Step2)',
            'is_active': false
          },
          {
            'operation_type_id': 41,
            'name': 'Asset:  Coffee Grinder(8). Template: Bean Preparation(18).Step: Tampering(Step3)',
            'is_active': false
          },
          {
            'operation_type_id': 37,
            'name': 'Asset:  Coffee Grinder(8). Template: Beverage Preparation(17).Step: Brewing Coffee(Step1)',
            'is_active': false
          },
          {
            'operation_type_id': 38,
            'name': 'Asset:  Coffee Grinder(8). Template: Beverage Preparation(17).Step: Quality Control(Step2)',
            'is_active': false
          }
        ]
        setWorkPlaceList(response.sort((a, b) => a.operation_type_id - b.operation_type_id));
      })
      .catch((err) => console.log(err));
  }, [changeConnectionHandler]);

  useEffect(() => {
    if (startDate && endDate && !isOpenFilter) {
      setPreloader(true);
      const fetchData = async () => {
        try {
          const response = await getOrderViewOperations(
            window.location.hostname,
            cookies.token,
            startDate,
            endDate
          );
          const dataToD3 = response.data;

          // const newDataPromises = dataToD3.map(async (zone) => {
          //   try {
          //   const res = await getSelectedZone(
          //     window.location.hostname,
          //     cookies.token,
          //     zone.zoneId
          //   );
          //   const oper = zone.oprs.reverse().map((operation, index, array) => ({
          //     zoneId: operation.zoneId,
          //     orId: operation.orId,
          //     camera: operation.camera,
          //     cameraName: operation.cameraName,
          //     algorithm: operation.algorithm,
          //     workplaceName: res?.data?.workplace ? res.data.workplace : '',
          //     sTime: new Date(operation.eTime).valueOf(),
          //     eTime:
          //       index < array.length - 1
          //         ? new Date(array[index + 1].sTime).valueOf()
          //         : new Date(operation.eTime).valueOf(),
          //   }));
          //   return {
          //     inverse: true,
          //     oprName: zone.oprName,
          //     oprTypeID: res?.data?.index_workplace ? res.data.index_workplace : '',
          //     workplaceID: res?.data?.index_workplace ? res.data.index_workplace : '',
          //     workplaceName: res?.data?.workplace ? res.data.workplace : '',
          //     oprs: oper,
          //   };
          // } catch (error) {
          //     if (error) {
          //       const oper = zone.oprs.reverse().map((operation, index, array) => ({
          //         zoneId: operation.zoneId,
          //         orId: operation.orId,
          //         camera: operation.camera,
          //         cameraName: operation.cameraName,
          //         algorithm: operation.algorithm,
          //         workplaceName: '',
          //         sTime: new Date(operation.eTime).valueOf(),
          //         eTime:
          //           index < array.length - 1
          //             ? new Date(array[index + 1].sTime).valueOf()
          //             : new Date(operation.eTime).valueOf(),
          //       }));
          //       return {
          //         inverse: true,
          //         oprName: zone.oprName,
          //         oprTypeID: zone.oprTypeID,
          //         workplaceID: '',
          //         workplaceName: '',
          //         oprs: oper,
          //       };
          //     } else {
          //       console.error(error);
          //       throw error;
          //     }
          //   }
          // });

          // const newData = await Promise.all(newDataPromises);
          setPreloader(false);
          setData(dataToD3);
          // setMachineData(newData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [endDate, startDate, isOpenFilter]);

  const handleZoomParamChange = (value) => {
    const newZoomParam = parseInt(value);
    setZoomParam(newZoomParam);
    if (
      checkMinTimeLimit(minDateTime, newZoomParam) &&
      checkMaxTimeLimit(maxDateTime, newZoomParam)
    )
      checkMinTimeInterval(minDateTime, maxDateTime, newZoomParam);
  };

  const checkMinTimeInterval = (startTime, endTime, param = zoomParam) => {
    let { minTimeRange, timeUnits } = minTimeIntervals[param];
    if (moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'), timeUnits) >= minTimeRange) {
      return true;
    } else {
      setMinDateTime(startTime);
      setMaxDateTime(moment(startTime, 'HH:mm').add(minTimeRange, timeUnits).format('HH:mm'));
      return false;
    }
  };

  const checkMinTimeLimit = (minTime, param = zoomParam) => {
    let { minTimeRange, timeUnits } = minTimeIntervals[param];
    if (moment('23:59', 'HH:mm').diff(moment(minTime, 'HH:mm'), timeUnits) >= minTimeRange)
      return true;
    else {
      setMinDateTime(
        moment('23:59', 'HH:mm')
          .add(-1 * minTimeRange, timeUnits)
          .format('HH:mm')
      );
      setMaxDateTime('23:59');
    }
  };

  const checkMaxTimeLimit = (maxTime, param = zoomParam) => {
    let { minTimeRange, timeUnits } = minTimeIntervals[param];
    if (moment(maxTime, 'HH:mm').diff(moment('00:00', 'HH:mm'), timeUnits) >= minTimeRange)
      return true;
    else {
      setMinDateTime('00:00');
      setMaxDateTime(moment('00:00', 'HH:mm').add(minTimeRange, timeUnits).format('HH:mm'));
    }
  };

  const handleMinDateTimeChange = (event) => {
    const minTime = event.target.value;
    if (checkMinTimeLimit(minTime) && checkMinTimeInterval(minTime, maxDateTime)) {
      setMinDateTime(minTime);
    }
  };

  const handleMaxDateTimeChange = (event) => {
    const maxTime = event.target.value;
    if (checkMaxTimeLimit(maxTime) && checkMinTimeInterval(minDateTime, maxTime)) {
      setMaxDateTime(maxTime);
    }
  };

  const scrollToBar = (orId) => {
    if (orId) {
      setZoomParam(32);
      setTimeout(() => {
        const timeline = document.querySelector('.verticalTimeline');
        const barElement = timeline.querySelector(`.bar-${orId}`);
        if (barElement) {
          barElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <>
      {filterDateData && endDate && startDate && (
        <div className={styles.fullScreen}>
          <OrdersList
            setSelectOrder={(order) => {
              setSelectOrder(order);
              scrollToBar(order)
            }}
            selectOrder={selectOrder}
            startDate={startDate}
            endDate={endDate}
            reload={isOpenFilter}
          />
          <VerticalTimeline
            data={data}
            minDate={new Date(`${startDate}T${minDateTime}:00.000`)}
            maxDate={new Date(`${endDate}T${maxDateTime}:00.000`)}
            minTime={new Date(`${startDate}T${minDateTime}:00.000`)}
            maxTime={new Date(`${startDate}T${maxDateTime}:00.000`)}
            selectOrder={selectOrder}
            preloader={preloader}
            machineData={machineData}
            zoomParam={zoomParam}
          />
          <div className={styles.paramInputs}>
            <SelectParam
              options={['1x', '2x', '4x', '8x', '16x', '32x']}
              selectedValue={`${zoomParam}x`}
              onChange={handleZoomParamChange}
            />
            <TimePicker
              label="Start time"
              id="minDateTime"
              value={minDateTime}
              onValueChange={handleMinDateTimeChange}
            />
            <TimePicker
              label="End time"
              id="maxDateTime"
              value={maxDateTime}
              onValueChange={handleMaxDateTimeChange}
            />
            <div className={styles.minIntervalInfo}>
              *Minimum interval:
              <br /> {minTimeIntervals[zoomParam].minTimeRange}{' '}
              {minTimeIntervals[zoomParam].minTimeRange === 1
                ? minTimeIntervals[zoomParam].timeUnits.slice(0, -1)
                : minTimeIntervals[zoomParam].timeUnits}
            </div>
          </div>
        </div>
      )}
      {isOpenFilter && (
        <Modal handleClose={setIsOpenFilter} className={styles.modal} isOpen={true}>
          <section className={styles.container}>
            <header className={styles.header}>
              <h2>Orders View settings</h2>
              <Cross onClick={setIsOpenFilter} className={styles.cross} />
            </header>
            <SelectConnection
              closeFilter={() => setIsOpenFilter(false)}
              changeHandler={setChangeConnectionHandler}
            />
            <main className={styles.content}>
              <span className={styles.content__name}>Displayed operations</span>
              <ul className={styles.content__list}>
                {workPlaceList.map((place, index) => {
                  return (
                    <li key={index}>
                      <Checkbox
                        id={index}
                        name={place.name}
                        label={place.name}
                        isChecked={place.is_active}
                        onChange={() => changeHandler(index)}
                      />
                    </li>
                  );
                })}
              </ul>
            </main>
            <footer className={styles.footer}>
              <Button text="Reset" variant="text" onClick={resetHandler} />
              <Button text="Done" onClick={submitHandler} />
            </footer>
          </section>
        </Modal>
      )}
    </>
  );
};

export default TimelineComponent;
