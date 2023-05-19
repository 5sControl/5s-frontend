/* eslint-disable @typescript-eslint/no-explicit-any */
import { enGB } from 'date-fns/locale';
import { DateRangePicker } from 'react-date-range';
import { useOutsideClick } from '../../functions/useOutsideClick';
import { useRef } from 'react';
import './dayPicker.scss';

type PropsType = {
  selectDate: string;
  handleSelect: (ranges: any) => void;
  onClose: () => void;
};

export const DayPicker: React.FC<PropsType> = ({ selectDate, handleSelect, onClose }) => {
  const refPicker = useRef(null);
  useOutsideClick(refPicker, () => onClose());

  const selectionRange = {
    startDate: new Date(selectDate),
    endDate: new Date(selectDate),
    key: 'selection',
  };
  return (
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
    </div>
  );
};
