import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
import styles from './style.module.scss';
import { selectOrdersList } from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppSelector } from '../../store/hooks';
import moment from 'moment';
import { getOrderViewOperations } from '../../api/orderView';
import { getData } from '../../api/reportsRequest';
import { useCookies } from 'react-cookie';
import { Algorithm } from '../../assets/svg/SVGcomponent';
import { getSelectedZone } from '../../api/cameraRequest';

export const TimelineComponent = () => {
  const { filterDateData } = useAppSelector(selectOrdersList);
  const [selectOrder, setSelectOrder] = useState('');
  const [data, setData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    setStartDate(moment(filterDateData.from).format('YYYY-MM-DD'));
    setEndDate(moment(filterDateData.to).format('YYYY-MM-DD'));
  }, [filterDateData]);

  useEffect(() => {
    if (startDate && endDate) {
      setPreloader(true);

      const fetchData = async () => {
        try {
          const response = await getOrderViewOperations(
            window.location.hostname,
            '',
            startDate,
            endDate
          );
          const dataToD3 = response.data;
          const dates = [];
          const currentDate = moment(startDate);
          while (currentDate.isSameOrBefore(endDate)) {
            dates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'day');
          }

          const dataPromises = dates.map((date) =>
            getData(
              window.location.hostname,
              cookies.token,
              date,
              '06:00:00',
              '20:00:00',
              'machine_control'
            )
          );

          const responses = await Promise.all(dataPromises);
          const data = responses.flatMap((response) =>
            response.data
              .filter((e) => e.extra?.zoneId)
              .map((el) => ({
                id: el.extra?.zoneId,
                zoneId: el.extra?.zoneId,
                zoneName: el.extra.zoneName.slice(5),
                sTime: el.start_tracking,
                eTime: el.stop_tracking,
                camera: el.camera?.id,
                cameraName: el.camera?.name,
                algorithm: el.algorithm?.name,
              }))
          );

          const grouped = data.reduce((acc, obj) => {
            const zoneName = obj.zoneName.trim();
            if (acc[zoneName]) {
              acc[zoneName].push(obj);
            } else {
              acc[zoneName] = [obj];
            }
            return acc;
          }, {});

          const answer = Object.entries(grouped).map(([zoneName, zoneData]) => ({
            inverse: true,
            oprName: zoneName,
            oprs: zoneData,
            zoneId: zoneData[0].zoneId,
          }));

          const newDataPromises = answer.map(async (zone) => {
            console.log(zone);
            try {
              const res = await getSelectedZone(
                window.location.hostname,
                cookies.token,
                zone.zoneId
              );
              const oper = zone.oprs.reverse().map((operation, index, array) => ({
                zoneId: operation.zoneId,
                orId: operation.orId,
                camera: operation.camera,
                cameraName: operation.cameraName,
                algorithm: operation.algorithm,
                workplaceName: res?.data?.workplace ? res.data.workplace : '',
                sTime: new Date(operation.eTime).valueOf() + 10800000,
                eTime:
                  index < array.length - 1
                    ? new Date(array[index + 1].sTime).valueOf() + 10800000
                    : new Date(operation.eTime).valueOf() + 10800000,
              }));
              return {
                inverse: true,
                oprName: zone.oprName,
                oprTypeID: res?.data?.index_workplace ? res.data.index_workplace : '',
                workplaceID: res?.data?.index_workplace ? res.data.index_workplace : '',
                workplaceName: res?.data?.workplace ? res.data.workplace : '',
                oprs: oper,
              };
            } catch (error) {
              if (error) {
                const oper = zone.oprs.reverse().map((operation, index, array) => ({
                  zoneId: operation.zoneId,
                  orId: operation.orId,
                  camera: operation.camera,
                  cameraName: operation.cameraName,
                  algorithm: operation.algorithm,
                  workplaceName: '',
                  sTime: new Date(operation.eTime).valueOf() + 10800000,
                  eTime:
                    index < array.length - 1
                      ? new Date(array[index + 1].sTime).valueOf() + 10800000
                      : new Date(operation.eTime).valueOf() + 10800000,
                }));
                return {
                  inverse: true,
                  oprName: zone.oprName,
                  oprTypeID: zone.oprTypeID,
                  workplaceID: '',
                  workplaceName: '',
                  oprs: oper,
                };
              } else {
                console.error(error);
                // Обработка других ошибок
                throw error; // Перебросить ошибку для дальнейшей обработки
              }
            }
          });

          const newData = await Promise.all(newDataPromises);

          console.log(newData);
          setPreloader(false);
          await setData(dataToD3);
          await setMachineData(newData);
        } catch (error) {
          console.log(error);
        }
      };

      // Вызов функции fetchData
      fetchData();
    }
  }, [endDate, startDate]);

  return (
    <>
      {filterDateData && endDate && startDate && (
        <div className={styles.fullScreen}>
          <OrdersList
            setSelectOrder={(order) => setSelectOrder(order)}
            selectOrder={selectOrder}
            startDate={startDate}
            endDate={endDate}
          />
          <VerticalTimeline
            data={data}
            minDate={new Date(`${startDate}T06:00:00.000`)}
            maxDate={new Date(`${endDate}T20:00:00.000`)}
            selectOrder={selectOrder}
            preloader={preloader}
            machineData={machineData}
          />
        </div>
      )}
    </>
  );
};

export default TimelineComponent;
