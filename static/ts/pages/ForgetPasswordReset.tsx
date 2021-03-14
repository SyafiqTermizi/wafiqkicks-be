import * as React from "react";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import axios from "../axiosConfig";

import { TitleBar } from "../components/TitleBar";
import { InputErrors } from "../components/InputErros";

interface iForgetPasswordReset {
  password: string[];
  confirm_password: string[];
  non_field_errors: string[];
}

export const ForgetPasswordReset = () => {
  const history = useHistory();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const initialErrors: iForgetPasswordReset = {
    password: [],
    confirm_password: [],
    non_field_errors: [],
  };

  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(initialErrors);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios()
      .post("/users/forget-password/confirm/", {
        uid,
        token,
        password,
        confirm_password,
      })
      .then((res) => history.push("/"))
      .catch((err) => setErrors({ ...initialErrors, ...err.response.data }));
  };

  return (
    <>
      <TitleBar title="Forget Password" />
      <div className="container" style={{ marginTop: "30vh" }}>
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="password"
                      id="password"
                      className={`form-control ${
                        errors.password.length > 0 ? "is-invalid" : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputErrors errors={errors.password} />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="confirm_password"
                      placeholder="confirm password"
                      id="confirm_password"
                      className={`form-control ${
                        errors.confirm_password.length > 0 ? "is-invalid" : ""
                      }`}
                      value={confirm_password}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputErrors errors={errors.confirm_password} />
                  </div>
                  <div className="form-group">
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-block btn-outline-primary"
                    />
                  </div>
                </form>
              </div>
              {errors.non_field_errors.map((errorMsg, idx) => (
                <div className="card-body text-center" key={idx}>
                  <div className="card-text text-danger">{errorMsg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
