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
  <div className="row mt-5 text-center">
    <div className="col mt-5">
      <div className="card card-shadow">
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <p>
                <small className="text-secondary">Kick Count</small>
                <br />
                <b className="text-primary">{kicks}</b>
              </p>
            </div>
            <div className="col-4">
              <p>
                <small className="text-secondary">First Kick</small>
                <br />
                <b className="text-primary">
                  {dayjs(firstKickTime).format("h:mm A")}
                </b>
              </p>
            </div>
            <div className="col-4">
              <p>
                <small className="text-secondary">Last Kick</small>
                <br />
                <b className="text-primary">
                  {dayjs(lastKickTime).format("h:mm A")}
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
