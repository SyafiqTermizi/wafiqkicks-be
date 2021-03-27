import * as React from "react";
import { useState } from "react";

interface Props {
  dates: string[];
}

export const FMCModal: React.FC<Props> = ({ dates }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setTodate] = useState("");

  return (
    <>
      <button
        type="button"
        className="btn btn-block btn-outline-primary"
        data-toggle="modal"
        data-target="#fmcModal"
      >
        Download Fetal Movement Chart
      </button>

      <div
        className="modal fade"
        id="fmcModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="fmcModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="fmcModal">
                Select date
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="fromDate">From</label>
                      <input
                        type="date"
                        name="fromDate"
                        id="fromDate"
                        className="form-control"
                        onChange={(e) => setFromDate(e.target.value)}
                        min={dates[dates.length - 1]}
                        max={dates[0]}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label htmlFor="toDate">To</label>
                    <input
                      type="date"
                      name="toDate"
                      id="toDate"
                      className="form-control"
                      onChange={(e) => setTodate(e.target.value)}
                      min={dates[dates.length - 1]}
                      max={dates[0]}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <a
                className={`btn btn-primary ${
                  !Boolean(fromDate) || !Boolean(toDate) ? "disabled" : ""
                }`}
                href={`/kicks/fetal-movement-chart?from_date=${fromDate}&to_date=${toDate}`}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
