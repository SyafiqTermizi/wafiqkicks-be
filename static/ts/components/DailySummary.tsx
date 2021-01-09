import * as React from "react";
import dayjs from "dayjs";

interface Props {
  kicks: number;
  firstKickTime: string;
  lastKickTime: string;
}

export const DailySummary: React.FC<Props> = ({
  kicks,
  firstKickTime,
  lastKickTime,
}) => (
  <div className="row mt-3 text-center">
    <div className="col-4">
      <p>Kicks</p>
      <p className="text-primary">
        <b>{kicks}</b>
      </p>
    </div>
    <div className="col-4">
      <p>First</p>
      <p className="text-primary">
        <b>{dayjs(firstKickTime).format("h:mm A")}</b>
      </p>
    </div>
    <div className="col-4">
      <p>Last</p>
      <p className="text-primary">
        <b>{dayjs(lastKickTime).format("h:mm A")}</b>
      </p>
    </div>
  </div>
);
