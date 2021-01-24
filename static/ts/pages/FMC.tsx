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
    axios
      .get("/kicks/fetal-movement-chart/")
      .then((res) => setDatas(res.data))
      .catch((err) => err);
  }, []);

  return (
    <>
      <TitleBar title="Fetal Movement Chart" />
      <div className="container mt-5 mb-5">
        <div className="row mb-5">
          <div className="col-12">
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th scope="col" rowSpan={2}>
                    Date
                  </th>
                  <th scope="col" rowSpan={2}>
                    Start
                  </th>
                  <th scope="col" colSpan={10}>
                    Movement
                  </th>
                  <th scope="col" rowSpan={2}>
                    Stop
                  </th>
                </tr>
                <tr>
                  {createArrayFromCount(10, true).map((count) => (
                    <th key={count}>{count}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datas.map((data) => (
                  <tr key={data.date}>
                    <td>{data.date}</td>
                    <td>{dayjs(data.start).format("hh:mm a")}</td>
                    {createArrayFromCount(data.count, false).map(
                      (x, counter) => (
                        <td key={counter}>
                          <b>{x}</b>
                        </td>
                      )
                    )}
                    <td>{dayjs(data.stop).format("hh:mm a")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
