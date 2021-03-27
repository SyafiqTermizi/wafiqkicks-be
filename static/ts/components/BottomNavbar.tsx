import * as React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopwatch,
  faChartBar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch } from "../store/hooks";
import { setValues } from "../store/userSlice";

export const BottomNavbar = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="fixed-bottom navbar-light bg-light">
      <div className="row">
        <div className="col-4 text-center">
          <NavLink
            className="nav-link"
            activeClassName="text-primary"
            to="/home"
          >
            <FontAwesomeIcon icon={faStopwatch} />
          </NavLink>
        </div>
        <div className="col-4 text-center">
          <NavLink
            className="nav-link"
            activeClassName="text-primary"
            to="/chart"
          >
            <FontAwesomeIcon icon={faChartBar} />
          </NavLink>
        </div>
        <div className="col-4 text-center dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            id="dropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faUser} />
          </a>

          <div
            className="dropdown-menu"
            aria-labelledby="dropdownMenuLink"
            style={{ width: "70%" }}
          >
            <a
              className="dropdown-item"
              href="#"
              onClick={() =>
                // set user store to empty when logging out
                dispatch(setValues({ username: "", email: "", token: "" }))
              }
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
