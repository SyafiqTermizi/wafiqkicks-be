import * as React from "react";

interface Props {
  disableButton: boolean;
  submitFunc: () => void;
}

export const KickButton: React.FC<Props> = ({ disableButton, submitFunc }) => (
  <div className="row">
    <div className="col-12 text-center">
      <button
        onClick={() => submitFunc()}
        disabled={disableButton}
        className="btn btn-primary btn-lg"
      >
        Kick!
      </button>
    </div>
  </div>
);
