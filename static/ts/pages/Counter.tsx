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
    <div className="container" style={{ paddingTop: "35vh" }}>
      <div className="row">
        <div className="col-12 text-center">
          <button
            onClick={() => submit()}
            disabled={disableButton}
            className="btn btn-primary"
          >
            Kick!
          </button>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 text-center">
          <p>
            <b>Kicks:&nbsp;</b>
            {dailySummary.kicks}
          </p>
          <p>
            <b>First:&nbsp;</b>
            {dayjs(dailySummary.first).format("h:mm A")}
          </p>
          <p>
            <b>Latest:&nbsp;</b>
            {dayjs(dailySummary.last).format("h:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
};
