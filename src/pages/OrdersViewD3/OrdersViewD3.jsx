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
  const [startDate, setStartDate] = useState(moment(filterDateData.from).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment(filterDateData.to).format('YYYY-MM-DD'));

  useEffect(() => {
    setStartDate(moment(filterDateData.from).format('YYYY-MM-DD'));
    setEndDate(moment(filterDateData.to).format('YYYY-MM-DD'));
  }, [filterDateData]);

  useEffect(() => {
    getOrderViewOperations(window.location.hostname, '', startDate, endDate).then((response) => {
      console.log(response.data);
      setData(response.data);
    });
  }, []);

  return (
    filterDateData && (
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
        />
      </div>
    )
  );
};

export default TimelineComponent;
