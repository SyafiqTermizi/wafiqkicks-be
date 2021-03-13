import dayjs from "dayjs";
import * as React from "react";
import { useState, useEffect } from "react";

import axios from "../axiosConfig";
import { createArrayFromCount } from "../utils";
import { TitleBar } from "../components/TitleBar";

interface Data {
  start: string;
  stop: string;
  count: number;
  date: string;
}

export const FetalMovementChart = () => {
  const [datas, setDatas] = useState<Data[]>([]);

  useEffect(() => {
    axios()
      .get("/kicks/fetal-movement-chart/")
      .then((res) => setDatas(res.data))
      .catch((err) => err);
  }, []);

  return (
    <>
      <TitleBar title="Fetal Movement Chart" />
      <div className="container mt-5 mb-5">
        <div className="mt-5 row mb-5">
          <div className="mt-5 col-12">
            <div className="card card-shadow">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Start</th>
                    <th scope="col">Count</th>
                    <th scope="col">Stop</th>
                    <th scope="col">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((data) => (
                    <tr key={data.date}>
                      <td>{data.date}</td>
                      <td>{dayjs(data.start).format("h:mm a")}</td>
                      <td>{data.count}</td>
                      <td>{dayjs(data.stop).format("h:mm a")}</td>
                      <td>
                        {dayjs(data.stop).diff(dayjs(data.start), "hour")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
