import dayjs from "dayjs";
import * as React from "react";
import { useState, useEffect } from "react";

import axios from "../axiosConfig";
import { TitleBar } from "../components/TitleBar";

interface Data {
  start: string;
  stop: string;
  count: number;
  date: string;
}

export const FetalMovementChart = () => {
  const TOTAL_MOVEMENT = 10;

  const [datas, setDatas] = useState<Data[]>([]);

  useEffect(() => {
    axios
      .get("/kicks/fetal-movement-chart/")
      .then((res) => setDatas(res.data))
      .catch((err) => err);
  }, []);

  const createThFromCount = (count: number, useCounter: boolean) => {
    const emptyThCount = TOTAL_MOVEMENT - count;
    const ths = [];
    for (let i = 0; i < count; i++) {
      ths.push(<th key={`i ${i}`}>{`${useCounter ? i + 1 : "x"}`}</th>);
    }
    for (let j = 0; j < emptyThCount; j++) {
      ths.push(<th key={`j ${j}`}></th>);
    }
    return ths;
  };

  return (
    <>
      <TitleBar title="Fetal Movement Chart" />
      <div className="container mt-5">
        <div className="row">
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
                <tr>{createThFromCount(10, true)}</tr>
              </thead>
              <tbody>
                {datas.map((data) => (
                  <tr key={data.date}>
                    <td>{data.date}</td>
                    <td>{dayjs(data.start).format("hh:mm a")}</td>
                    {createThFromCount(data.count, false)}
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
