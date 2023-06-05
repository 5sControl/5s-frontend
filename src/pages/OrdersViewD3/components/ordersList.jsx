import { useEffect, useState } from 'react';
import '../style.css';

export const OrdersList = ({ setSelectOrder, selectOrder, startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://5scontrol.pl/proxy_to_ngrok/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://0bc5-81-7-77-205.ngrok-free.app/api/new-order/orders/?from=${startDate}&to=${endDate}`,
        method: 'GET',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        const uniqueOrderNames = [...new Set(data.map((item) => item.orderName))];
        console.log(uniqueOrderNames);
        setData(uniqueOrderNames);
      });
  }, [startDate, endDate]);

  return (
    <div className="orders">
      <h2>Orders ({data.length})</h2>
      <div className="orders__list">
        {data.map((item, index) => (
          <span
            key={index}
            className={`orders__item ${selectOrder === item ? 'select' : ''}`}
            onClick={() => setSelectOrder(item)}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
