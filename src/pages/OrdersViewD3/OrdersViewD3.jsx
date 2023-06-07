import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
// import { data } from './base/data';
import styles from './style.module.scss';
import { selectOrdersList } from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppSelector } from '../../store/hooks';
import moment from 'moment';
import { getOrderViewOperations } from '../../api/orderView';

export const TimelineComponent = () => {
  const { filterDateData } = useAppSelector(selectOrdersList);
  const [selectOrder, setSelectOrder] = useState('');
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [preloader, setPreloader] = useState(false);

  useEffect(() => {
    setStartDate(moment(filterDateData.from).format('YYYY-MM-DD'));
    setEndDate(moment(filterDateData.to).format('YYYY-MM-DD'));
  }, [filterDateData]);

  useEffect(() => {
    if (startDate && endDate) {
      setPreloader(true);
      getOrderViewOperations(window.location.hostname, '', startDate, endDate)
        .then((response) => {
          setPreloader(false);
          setData(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [endDate, startDate]);

  return (
    filterDateData &&
    endDate &&
    endDate && (
      <div className={styles.fullScreen}>
        <OrdersList
          setSelectOrder={(order) => setSelectOrder(order)}
          selectOrder={selectOrder}
          startDate={startDate}
          endDate={endDate}
        />
        <VerticalTimeline
          data={data}
          minDate={new Date(`${startDate}T03:00:00.000Z`)}
          maxDate={new Date(`${endDate}T17:00:00.000Z`)}
          selectOrder={selectOrder}
          preloader={preloader}
        />
      </div>
    )
  );
};

export default TimelineComponent;
