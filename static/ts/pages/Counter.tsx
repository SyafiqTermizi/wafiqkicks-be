import * as React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import axios from "../axiosConfig";

export const Counter: React.FC = () => {
  const [disableButton, setDisableButton] = useState(false);
  const [dailySummary, setDailySummary] = useState({
    kicks: 0,
    first: 0,
    last: 0,
  });

  const fetchDailySummary = () => {
    axios
      .get("/kicks/daily-summary/")
      .then((res) => setDailySummary(res.data))
      .catch((err) => err);
  };

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const submit = () => {
    setDisableButton(true);
    axios
      .post("/kicks/count-up/")
      .then((_) => {
        fetchDailySummary();
        setTimeout(() => {
          setDisableButton(false);
        }, 59999);
      })
      .catch((err) => err);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <a className="navbar-brand text-white" href="#">
          Kick Counter
        </a>
      </nav>
      <div className="container" style={{ paddingTop: "35vh" }}>
        <div className="row">
          <div className="col-12 text-center">
            <button
              onClick={() => submit()}
              disabled={disableButton}
              className="btn btn-primary btn-lg"
            >
              Kick!
            </button>
          </div>
        </div>
        {Boolean(dailySummary.kicks) && (
          <div className="row mt-3 text-center">
            <div className="col-4">
              <p>Kicks</p>
              <p className="text-primary">
                <b>{dailySummary.kicks}</b>
              </p>
            </div>
            <div className="col-4">
              <p>First</p>
              <p className="text-primary">
                <b>{dayjs(dailySummary.first).format("h:mm A")}</b>
              </p>
            </div>
            <div className="col-4">
              <p>Last</p>
              <p className="text-primary">
                <b>{dayjs(dailySummary.last).format("h:mm A")}</b>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
