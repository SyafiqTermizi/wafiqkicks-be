import * as React from "react";
import dayjs from "dayjs";

interface Props {
  setSelectedDate: (date: string) => void;
  selectedDate: string;
  kickDates: string[];
}

export const DateSelect: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  kickDates,
}) => (
  <div className="row">
    <div className="col-12">
      <select
        className="form-control"
        name="date"
        onChange={(e) => setSelectedDate(e.target.value)}
        value={selectedDate}
      >
        {kickDates.map((date) => (
          <option value={date} key={date}>
            {dayjs(date).format("ddd D MMM YYYY")}
          </option>
        ))}
      </select>
    </div>
  </div>
);
