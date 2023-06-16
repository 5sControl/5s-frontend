import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
// import { data } from './base/data';
import styles from './style.module.scss';
import { selectOrdersList } from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppSelector } from '../../store/hooks';
import moment from 'moment';
import { getOrderViewOperations, getWorkplaceList } from '../../api/orderView';
import { getData } from '../../api/reportsRequest';
import { useCookies } from 'react-cookie';
import { Algorithm } from '../../assets/svg/SVGcomponent';

export const TimelineComponent = () => {
  const { filterDateData } = useAppSelector(selectOrdersList);
  const [selectOrder, setSelectOrder] = useState('');
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [cookies] = useCookies(['token']);
  console.log(moment(1686041363822).format('YYYY-MM-DD HH:mm:ss'));
  useEffect(() => {
    setStartDate(moment(filterDateData.from).format('YYYY-MM-DD'));
    setEndDate(moment(filterDateData.to).format('YYYY-MM-DD'));
  }, [filterDateData]);

  useEffect(() => {
    if (startDate && endDate) {
      setPreloader(true);

      getOrderViewOperations(window.location.hostname, '', startDate, endDate)
        .then((response) => {
          const dataToD3 = response.data;
          // const newData = [];
          // console.log(data);
          // data.forEach((zone) => {
          //   const oper = zone.oprs.map((oper, index, array) => {
          //     return {
          //       zoneId: oper.zoneId,
          //       orId: oper.orId,
          //       camera: oper.camera,
          //       sTime: oper.eTime,
          //       eTime: index < array.length - 1 ? zone.oprs[index + 1].sTime : oper.eTime + 100,
          //     };
          //   });
          //   newData.push({
          //     inverse: false,
          //     oprName: zone.oprName,
          //     oprTypeID: zone.oprTypeID,
          //     oprs: oper,
          //   });
          // });
          getData(
            window.location.hostname,
            cookies.token,
            startDate,
            '06:00:00',
            '20:00:00',
            'machine_control'
          ).then((res) => {
            getWorkplaceList(window.location.hostname, cookies.token).then((workplace) => {
              console.log(res);
              const data = res.data
                .filter((e) => e.extra?.zoneId)
                .map((el) => {
                  return {
                    id: el.extra.zoneId,
                    zoneId: el.extra.zoneId,
                    zoneName: el.extra.zoneName.slice(5),
                    sTime: el.start_tracking,
                    eTime: el.stop_tracking,
                    camera: el.camera.id,
                  };
                });
              console.log(data);
              const grouped = {};

              // Проходим по каждому элементу массива
              data.forEach((obj) => {
                const zoneName = obj.zoneName.trim(); // Удаляем лишние пробелы в начале и конце строки
                if (grouped[zoneName]) {
                  // Если группа уже существует, добавляем текущий объект в нее
                  grouped[zoneName].push(obj);
                } else {
                  // Если группы нет, создаем новую и добавляем текущий объект
                  grouped[zoneName] = [obj];
                }
              });
              console.log(Object.entries(grouped));
              const answer = Object.entries(grouped).map((el) => {
                return {
                  inverse: true,
                  oprName: el[0],
                  oprs: el[1],
                  oprTypeID: el[1][0].zoneId,
                };
              });

              const newData = [];
              answer.forEach((zone) => {
                const oper = zone.oprs.reverse().map((operation, index, array) => {
                  return {
                    zoneId: operation.zoneId,
                    orId: operation.orId,
                    camera: operation.camera,
                    sTime: new Date(operation.eTime).valueOf(),
                    eTime:
                      index < array.length - 1
                        ? new Date(array[index + 1].sTime).valueOf()
                        : operation.eTime,
                  };
                });
                newData.push({
                  inverse: true,
                  oprName: zone.oprName,
                  oprTypeID: zone.oprTypeID,
                  oprs: oper,
                });
              });
              console.log(newData);
              setPreloader(false);
              setData([...newData, ...dataToD3]);
            });
          });
          // setData([...response.data]);
        })
        .catch((error) => console.log(error));
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
          />
        </div>
      )}
    </>
  );
};

export default TimelineComponent;
