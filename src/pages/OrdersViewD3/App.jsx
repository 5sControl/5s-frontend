import { useEffect, useState } from 'react';
import VerticalTimeline from './components/VerticalTimeline';
import { OrdersList } from './components/ordersList';
import { data } from './base/data';
export const TimelineComponent = () => {
  // const [data, setData] = useState([]);
  const [selectOrder, setSelectOrder] = useState('');
  const startDate = '2023-05-26';
  const endDate = '2023-05-29';
  // useEffect(() => {
  //   fetch("https://5scontrol.pl/proxy_to_ngrok/", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       url: `https://0bc5-81-7-77-205.ngrok-free.app/api/new-order/operations/?from=${startDate}&to=${endDate}`,
  //       method: "GET",
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setData(data);
  //     });
  // }, []);

  return (
    <div className="fullScreen">
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
  );
};

export default TimelineComponent;
