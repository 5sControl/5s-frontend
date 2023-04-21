import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datapicker.scss';

import { enGB } from 'date-fns/locale';

export const DataPicker = ({ setSelectDate, setVisibleModalDate, selectDateDash }) => {
  const selectDate = (date) => {
    setSelectDate(moment(date).format('YYYY-MM-DD'));
    setVisibleModalDate(false);
  };
  const locale = {
    ...enGB,
    firstDayOfWeek: 1, // 1 - для понедельника
  };
  return (
    <div className="datapicker">
      <DatePicker
        locale={locale}
        selected={new Date(selectDateDash)}
        onChange={(date) => selectDate(date)}
        inline
        maxDate={new Date()}
        weekStartsOn={1}
      />
    </div>
  );
};
