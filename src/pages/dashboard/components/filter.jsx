import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Импортируйте стили
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import { enGB } from 'date-fns/locale';

export const FilterForm = ({ update, selectDate, setSelectDate }) => {
  console.log(new Date(selectDate));
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date(selectDate));
  const handleSelect = (ranges) => {
    console.log(ranges);
    // Определяем дату начала и записываем ее в state
    setSelectDate(moment(ranges.selection.startDate).format('YYYY-MM-DD'));
    setVisibleModalDate(false);
  };

  const selectionRange = {
    startDate: new Date(selectDate),
    endDate: new Date(selectDate),
    key: 'selection',
  };

  return (
    <div className="dashboard__title">
      <h1 className="dashboard__title_h1">Dashboard</h1>
      <div className="dashboard__title__filter">
        <button
          onClick={() => setVisibleModalDate(!visibleModalDate)}
          className="dashboard__title_button"
        >
          {`${selectDate}`}
        </button>
      </div>

      {visibleModalDate && (
        // <DataPicker
        //   setSelectDate={(e) => setSelectDate(e)}
        //   update={update}
        //   setVisibleModalDate={(e) => setVisibleModalDate(e)}
        //   selectDateDash={selectDate}
        // />

        <DateRangePicker
          locale={enGB}
          ranges={[selectionRange]}
          onChange={handleSelect}
          dateDisplayFormat="dd MMM yyyy"
          showMonthAndYearPickers={false}
          rangeColors={['var(--Orange)', 'var(--Orange)']}
        />
      )}
    </div>
  );
};
