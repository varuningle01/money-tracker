import { addDays, format, subDays } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "./DatePicker.css";
import { useTransactionContext } from "../context/TransactionContext";
const DatePicker = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { state, dispatch } = useTransactionContext();
  const { selectedDate } = state;

  const handleButtonClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateChange = (date: Date) => {
    dispatch({ type: "SET_DATE", payload: date });
    setIsDatePickerOpen(false);
  };
  const handleMonthChange = (date: Date) => {
    dispatch({ type: "SET_DATE", payload: date });
  };
  const handleDayForward = () => {
    dispatch({ type: "SET_DATE", payload: addDays(selectedDate, 1) });
  };
  const handleDayBackward = () => {
    dispatch({ type: "SET_DATE", payload: subDays(selectedDate, 1) });
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
        <button
          className="btn border border-dark me-2"
          onClick={handleDayBackward}
        >
          &#9664;
        </button>
        <button
          className="btn border border-dark me-2"
          onClick={handleButtonClick}
        >
          {format(selectedDate, "dd/MM/yyyy")}
        </button>
        <button className="btn border border-dark" onClick={handleDayForward}>
          &#9654;
        </button>
      </div>
      {isDatePickerOpen && (
        <div className="daypicker">
          <DayPicker
            selected={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            month={selectedDate}
          />
        </div>
      )}
    </div>
  );
};

export { DatePicker };
