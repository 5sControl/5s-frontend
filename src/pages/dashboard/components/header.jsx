import { useState, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Импортируйте стили
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import { enGB } from 'date-fns/locale';
import { Button } from '../../../components/button';
import { useOutsideClick } from '../../../functions/useOutsideClick';

import './datapicker.scss';
import { ArrowBottom, Filter } from '../../../assets/svg/SVGcomponent';
import { FilterForm } from './filter';

export const Header = ({ selectDate, setSelectDate, cameras, algorithms, dataCount }) => {
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
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
    setVisibleModalDate(false);
  };
  return (
    <div className="dashboard__title">
      <h1 className="dashboard__title_h1">Dashboard</h1>
      <div className="dashboard__title__filter">
        <Button
          text="Filter"
          IconLeft={Filter}
          type="button"
          variant="oval"
          // iconColor={searchParams.get('order-status') ? 'var(--Orange)' : 'var(--HightEmphasis)'}
          onClick={() => setIsShowFilter(true)}
        />
        <button
          onClick={() => setVisibleModalDate(!visibleModalDate)}
          className="dashboard__title_button"
        >
          {`${moment(selectDate).format('ll')}`}
          <ArrowBottom style={{ color: 'red', marginLeft: '10px', width: '9px' }} />
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
            maxDate={new Date()}
          />
          <div className={'picker-dashboard_buttons'}>
            <Button text="Cancel" variant="outlined" onClick={handleClick} />
            <Button text="Apply" variant="contained" onClick={handleClickApply} />
          </div>
        </div>
      )}
      {isShowFilter && (
        <FilterForm
          setIsShowFilter={() => setIsShowFilter(false)}
          cameras={cameras}
          algorithms={algorithms}
          dataCount={dataCount}
        />
      )}
    </div>
  );
};
