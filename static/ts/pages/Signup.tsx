import * as React from "react";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import axios from "../axiosConfig";
import { InputErrors } from "../components/InputErros";

import { TitleBar } from "../components/TitleBar";

interface iSignupError {
  username: string[];
  name: string[];
  email: string[];
  password: string[];
  confirm_password: string[];
  non_field_errors: string[];
}

export const Signup: React.FC = () => {
  const history = useHistory();
  const initialErrors: iSignupError = {
    username: [],
    name: [],
    email: [],
    password: [],
    confirm_password: [],
    non_field_errors: [],
  };

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(initialErrors);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios()
      .post("/users/signup/", {
        username,
        name,
        email,
        password,
        confirm_password,
      })
      .then((res) => history.push("/signin"))
      .catch((err) => setErrors({ ...initialErrors, ...err.response.data }));
  };

  return (
    <>
      <TitleBar title="Signup" />
      <div className="container" style={{ marginTop: "20vh" }}>
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="username"
                      placeholder="username"
                      id="username"
                      className={`form-control ${
                        errors.username.length > 0 ? "is-invalid" : ""
                      }`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputErrors errors={errors.username} />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="name"
                      id="name"
                      className={`form-control ${
                        errors.name.length > 0 ? "is-invalid" : ""
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <InputErrors errors={errors.name} />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="email"
                      id="email"
                      className={`form-control ${
                        errors.email.length > 0 ? "is-invalid" : ""
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputErrors errors={errors.email} />
                  </div>
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
                      value="Signup"
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
                Have an account?{" "}
                <b>
                  <Link to="/signin">Signin</Link>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
