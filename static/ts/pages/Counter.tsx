import * as React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import axios from "../axiosConfig";
import { TitleBar } from "../components/TitleBar";
import { DailySummary } from "../components/DailySummary";

interface Props {
  disableButton: boolean;
  setDisableButton: (value: any) => void;
}

export const Counter: React.FC<Props> = ({
  disableButton,
  setDisableButton,
}) => {
  const [dailySummary, setDailySummary] = useState({
    kicks: 0,
    first: "",
    last: "",
  });

  const canKick = (kickCount: number, lastKickTimeStr: string) => {
    if (kickCount === 10) {
      setDisableButton(true);
      return;
    }

    const lastKickTime = dayjs(lastKickTimeStr);
    const timeDelta = dayjs().diff(lastKickTime, "millisecond");

    if (timeDelta < 59999) {
      setDisableButton(true);
      setTimeout(() => {
        setDisableButton(false);
      }, 59999 - timeDelta);
    }
  };

  const fetchDailySummary = () => {
    axios
      .get("/kicks/daily-summary/")
      .then((res) => {
        setDailySummary(res.data);
        canKick(res.data.kicks, res.data.last);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const submit = () => {
    setDisableButton(true);
    axios
      .post("/kicks/count-up/")
      .then((_) => fetchDailySummary())
      .catch((err) => err);
  };

  return (
    <>
      <TitleBar title="Kick Counter" />
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
          <DailySummary
            kicks={dailySummary.kicks}
            firstKickTime={dailySummary.first}
            lastKickTime={dailySummary.last}
          />
        )}
      </div>
    </>
  );
};
