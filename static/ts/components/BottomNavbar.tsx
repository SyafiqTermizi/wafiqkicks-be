import * as React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopwatch,
  faChartBar,
  faTable,
} from "@fortawesome/free-solid-svg-icons";

export const BottomNavbar = () => (
  <div className="fixed-bottom navbar-light bg-light">
    <div className="row">
      <div className="col-4 text-center">
        <NavLink className="nav-link" activeClassName="text-primary" to="/home">
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
    </div>
  </div>
);
