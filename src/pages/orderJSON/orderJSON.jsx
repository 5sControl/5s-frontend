import { useEffect, useState } from 'react';
import { proxy } from '../../api/api';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import { DayPicker } from '../../components/dayPicker/dayPicker';
import { Input } from '../../components/input';

export const OrderJSON = () => {
  const [cookies] = useCookies(['token']);
  const [start, setStart] = useState(moment().format('YYYY-MM-DD'));
  const [response, setResponse] = useState([]);
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [text, setText] = useState('');

  const serach = (id) => {
    proxy('https://0bc5-81-7-77-205.ngrok-free.app/api/order/by-order/' + text, 'GET', {
      Authorization: cookies.token,
    }).then((res) => {
      console.log(res.data[0]);
    });
  };

  useEffect(() => {
    proxy(
      `${process.env.REACT_APP_NGROK}api/order/all-orders/?page=1&page_size=100&from=${start}T15%3A38%3A27.780Z&to=${start}T15%3A38%3A27.780Z`,
      'GET',
      {
        Authorization: cookies.token,
      }
    ).then((res) => {
      console.log(res.data.results);
      setResponse(res.data.results);
    });
  }, [start]);

  const handleSelect = (e) => {
    setVisibleModalDate(false);
    setStart(moment(e.selection.startDate).format('YYYY-MM-DD'));
  };

  const handleText = (e) => {
    setText(e.target.value);
  };

  const send = (e) => {
    if (e.code === 'Enter') {
      serach(text);
    }
  };

  return (
    <div>
      <span onClick={() => setVisibleModalDate(true)}>{start}</span>
      <Input onChange={(e) => handleText(e)} value={text} onKeyDown={(e) => send(e)} />
      {visibleModalDate && (
        <DayPicker
          selectDate={start}
          handleSelect={handleSelect}
          onClose={() => setVisibleModalDate(false)}
        />
      )}
      {response.length > 0 &&
        response.map((item, index) => (
          <div key={index}>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
            <br />
          </div>
        ))}
    </div>
  );
};
