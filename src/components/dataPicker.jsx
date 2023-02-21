import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DataPicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate]);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <>
      <button className="example-custom-input" onClick={handleClick}>
        Select Date
      </button>
      {isOpen && (
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          //excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
          selectsRange
          selectsDisabledDaysInRange
          maxDate={new Date()}
          inline
        />
      )}
    </>
  );
};
