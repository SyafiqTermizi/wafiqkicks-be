import * as React from "react";

interface Props {
  hourlyKicks: { [key: string]: string };
}

export const HourlyKick: React.FC<Props> = ({ hourlyKicks }) => {
  const sum = (previousValue: any, currentValue: any) =>
    previousValue + currentValue;

  const totalkick = Object.values(hourlyKicks).reduce(sum, 0) as number;

  return (
    <div className="row mt-5 mb-5">
      <div className="col-12 mb-5">
        <div className="card card-shadow">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(hourlyKicks).map((hour) => (
                <tr key={hour}>
                  <td scope="row">{hour}</td>
                  <td>{hourlyKicks[hour]}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>
                  <b>{totalkick}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
