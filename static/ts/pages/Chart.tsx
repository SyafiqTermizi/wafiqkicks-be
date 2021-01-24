import * as React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { isObjectEmpty } from "../utils";
import { TitleBar } from "../components/TitleBar";
import axios from "../axiosConfig";

interface Data {
  [key: string]: string;
}

export const Chart: React.FC = () => {
  const [kickPerHour, setKickPerHour] = useState<Data>({});
  const [totalKicks, setTotalKicks] = useState<number>(0);
  const [kickDates, setKickDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchData = () => {
    if (!selectedDate) return;
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
      .then((res) => {
        setKickDates(res.data);
        if (res.data.length > 0) {
          setSelectedDate(res.data[0]);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  return (
    <>
      <TitleBar title="Hourly Kicks" />
      <br />
      <div className="container mt-5">
        {kickDates.length > 0 && (
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
        )}
        <div className="row mt-5 mb-5">
          <div className="col-12 mb-5">
            <div className="card card-shadow">
              <table className="table">
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
                    <td>Total</td>
                    <td>
                      <b>{totalKicks}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
