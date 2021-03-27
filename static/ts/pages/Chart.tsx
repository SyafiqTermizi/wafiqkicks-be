import * as React from "react";
import { useState, useEffect } from "react";

import { isObjectEmpty } from "../utils";
import { TitleBar } from "../components/TitleBar";
import { HourlyKick } from "../components/HourlyKick";
import { DateSelect } from "../components/DateSelect";
import axios from "../axiosConfig";

interface Data {
  [key: string]: string;
}

export const Chart: React.FC = () => {
  const [kickPerHour, setKickPerHour] = useState<Data>({});
  const [kickDates, setKickDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchData = () => {
    if (!selectedDate) return;
    axios()
      .get(`/kicks/daily-chart/?date=${selectedDate}`)
      .then((res) => {
        if (isObjectEmpty(res.data)) return;
        setKickPerHour(res.data);
      })
      .catch((err) => err);
  };

  const fetchDates = () => {
    axios()
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
          <DateSelect
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            kickDates={kickDates}
          />
        )}
        <HourlyKick hourlyKicks={kickPerHour} />
        <a
          href="/kicks/fetal-movement-chart"
          className="btn btn-outline-primary btn-block"
        >
          Download Fetal Movement Chart
        </a>
      </div>
    </>
  );
};
