import { useState } from 'react';
import { DataPicker } from './dataPicker';

export const FilterForm = ({ update, selectDate, setSelectDate }) => {
  const [visibleModalDate, setVisibleModalDate] = useState(false);

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
        <DataPicker
          setSelectDate={(e) => setSelectDate(e)}
          update={update}
          setVisibleModalDate={(e) => setVisibleModalDate(e)}
          selectDateDash={selectDate}
        />
      )}
    </div>
  );
};
