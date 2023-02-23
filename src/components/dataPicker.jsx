import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DataPicker = ({setSelectDate, setVisibleModalDate, selectDateDash}) => {

  const selectDate = (date) => {
    setSelectDate(moment(date).format("YYYY-MM-DD"))
    setVisibleModalDate(false)
  }
  return (
        <DatePicker
        selected={new Date(selectDateDash)}
        onChange={(date) => selectDate(date)}
        inline
        maxDate={new Date()}
      />
  );
};
