import * as React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import axios from "../axiosConfig";
export interface Data {
  [key: string]: string;
}

export const Chart: React.FC = () => {
  const isObjectEmpty = (obj: { [key: string]: string }) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

  const [kickPerHour, setKickPerHour] = useState<Data>({});
  const [totalKicks, setTotalKicks] = useState<number>(0);
  const [kickDates, setKickDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchData = () => {
    axios
      .get(`/kicks/daily-chart/?date=${selectedDate}`)
      .then((res) => {
        if (isObjectEmpty(res.data)) return;
        const sum = (previousValue: any, currentValue: any) =>
          previousValue + currentValue;
        const totalKicks = Object.values(res.data).reduce(sum, 0) as number;
        setTotalKicks(totalKicks);
        setKickPerHour(res.data);
      })
      .catch((err) => err);
  };

  const fetchDates = () => {
    axios
      .get("/kicks/dates/")
      .then((res) => setKickDates(res.data))
      .catch((err) => err);
  };

  useEffect(() => {
    fetchData();
    fetchDates();
  }, [selectedDate]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3>Hourly Kicks</h3>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <select
            className="form-control"
            name="cars"
            id="cars"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {kickDates.map((date) => (
              <option value={date} key={date}>
                {dayjs(date).format("ddd D MMM YYYY")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(kickPerHour).map((hour) => (
                <tr key={hour}>
                  <td scope="row">{hour}</td>
                  <td>{kickPerHour[hour]}</td>
                </tr>
              ))}
              <tr>
                <th>Total</th>
                <td>{totalKicks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
