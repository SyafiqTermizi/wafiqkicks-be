import * as React from "react";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import axios from "../axiosConfig";
import { useAppDispatch } from "../store/hooks";
import { setValues } from "../store/userSlice";

import { TitleBar } from "../components/TitleBar";
import { InputErrors } from "../components/InputErros";

interface iSigninError {
  email_or_username: string[];
  password: string[];
  non_field_errors: string[];
}

export const Signin: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const initialErrors: iSigninError = {
    email_or_username: [],
    password: [],
    non_field_errors: [],
  };

  const [email_or_username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrors);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios()
      .post("/users/signin/", { email_or_username, password })
      .then((res) => {
        dispatch(setValues(res.data));
        history.push("/");
      })
      .catch((err) => setErrors({ ...initialErrors, ...err.response.data }));
  };

  return (
    <>
      <TitleBar title="Signin" />
      <div className="container" style={{ marginTop: "30vh" }}>
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="email_or_username"
                      placeholder="Username or Email"
                      id="usernameoremail"
                      className={`form-control ${
                        errors.email_or_username.length > 0 ? "is-invalid" : ""
                      }`}
                      value={email_or_username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputErrors errors={errors.email_or_username} />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      id="password"
                      className={`form-control ${
                        errors.email_or_username.length > 0 ? "is-invalid" : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputErrors errors={errors.password} />
                  </div>
                  <div className="form-group">
                    <input
                      type="submit"
                      value="Signin"
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
            <div className="card mt-2">
              <div className="card-body text-center">
                Don't have an account?{" "}
                <b>
                  <Link to="/signup">Signup</Link>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
