import { useState, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Импортируйте стили
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import { enGB } from 'date-fns/locale';
import { Button } from '../../../components/button';
import { useOutsideClick } from '../../../functions/useOutsideClick';
export const FilterForm = ({ selectDate, setSelectDate }) => {
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const refPicker = useRef(null);

  const handleSelect = (ranges) => {
    setSelectDate(moment(ranges.selection.startDate).format('YYYY-MM-DD'));
    setVisibleModalDate(false);
  };

  const selectionRange = {
    startDate: new Date(selectDate),
    endDate: new Date(selectDate),
    key: 'selection',
  };
  useOutsideClick(refPicker, () => setVisibleModalDate(false));
  const handleClick = () => {
    setVisibleModalDate(false);
  };
  const handleClickApply = () => {
    console.log('sdfsdf');
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
        <div className="picker-dashboard" ref={refPicker}>
          <DateRangePicker
            locale={enGB}
            ranges={[selectionRange]}
            onChange={handleSelect}
            dateDisplayFormat="dd MMM yyyy"
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            inputRanges={[]}
            rangeColors={['var(--Orange)', 'var(--Orange)']}
          />
          <div className={'picker-dashboard_buttons'}>
            <Button text="Cancel" variant="outlined" onClick={handleClick} />
            <Button text="Apply" variant="contained" onClick={handleClickApply} />
          </div>
        </div>
      )}
    </div>
  );
};
