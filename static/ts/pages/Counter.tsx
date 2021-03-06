import * as React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import axios from "../axiosConfig";
import { TitleBar } from "../components/TitleBar";
import { DailySummary } from "../components/DailySummary";
import { KickButton } from "../components/KickButton";

export const Counter: React.FC = () => {
  const [disableButton, setDisableButton] = useState(false);
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
    axios()
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
    axios()
      .post("/kicks/count-up/")
      .then((_) => fetchDailySummary())
      .catch((err) => err);
  };

  return (
    <>
      <TitleBar title="Kick Counter" />
      <div className="container" style={{ paddingTop: "35vh" }}>
        <KickButton submitFunc={submit} disableButton={disableButton} />
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
