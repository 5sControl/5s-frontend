import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
// import { data } from './base/data';
import styles from './style.module.scss';
import { selectOrdersList } from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppSelector } from '../../store/hooks';
import moment from 'moment';
import { getOrderViewOperations } from '../../api/orderView';
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
      getData(
        window.location.hostname,
        cookies.token,
        endDate,
        '06:00:00',
        '20:00:00',
        'machine_control'
      ).then((res) => {
        const data = res.data
          .filter((e) => e.extra.zoneId)
          .map((el) => {
            return {
              zoneId: el.extra.zoneId,
              zoneName: el.extra.zoneName,
              sTime: el.start_tracking,
              eTime: el.stop_tracking,
            };
          });

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
        console.log(grouped);
      });

      getOrderViewOperations(window.location.hostname, '', startDate, endDate)
        .then((response) => {
          setPreloader(false);
          setData(response.data);
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
