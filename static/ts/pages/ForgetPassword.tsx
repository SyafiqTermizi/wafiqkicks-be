import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import axios from "../axiosConfig";

import { TitleBar } from "../components/TitleBar";

interface iForgetPasswordError {
  email_address: string[];
}

export const ForgetPassword = () => {
  const initialErrors: iForgetPasswordError = {
    email_address: [],
  };

  const [email_address, setEmailAddress] = useState("");
  const [errors, setErrors] = useState(initialErrors);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios()
      .post("/users/forget-password/", { email_address })
      .then((_) => setFormSubmitted(true))
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
                {!formSubmitted && (
                  <form onSubmit={(e) => submitForm(e)}>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email_address"
                        placeholder="email"
                        id="email"
                        className={`form-control ${
                          errors.email_address.length > 0 ? "is-invalid" : ""
                        }`}
                        value={email_address}
                        onChange={(e) => setEmailAddress(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Send Login Link"
                        className="btn btn-outline-primary btn-block"
                      />
                    </div>
                  </form>
                )}
                {formSubmitted && (
                  <div className="card-text text-center">
                    We’ve emailed you instructions for setting your password, if
                    an account exists with the email you entered. You should
                    receive them shortly.
                  </div>
                )}
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body text-center">
                <b>
                  <Link to="/signin">Back To Login</Link>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
