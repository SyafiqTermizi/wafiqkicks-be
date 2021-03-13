import * as React from "react";

interface Props {
  errors: string[];
}

export const InputErrors: React.FC<Props> = ({ errors }) => {
  const errorMessages = errors.map((error, idx) => (
    <div key={idx} className="invalid-feedback">
      {error}
    </div>
  ));
  return <>{errorMessages}</>;
};
