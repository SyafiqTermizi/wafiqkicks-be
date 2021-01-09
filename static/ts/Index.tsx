import * as React from "react";
import * as ReactDom from "react-dom";
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch, faChartBar } from "@fortawesome/free-solid-svg-icons";

import { Counter } from "./pages/Counter";
import { Chart } from "./pages/Chart";

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact={true}>
        <Redirect to="/home" />
      </Route>
      <Route path="/home" exact={true}>
        <Counter />
      </Route>
      <Route path="/chart" exact={true}>
        <Chart />
      </Route>
    </Switch>
    <div className="fixed-bottom navbar-light bg-light">
      <div className="row">
        <div className="col-6 text-center">
          <NavLink
            className="nav-link"
            activeClassName="text-primary"
            to="/home"
          >
            <FontAwesomeIcon icon={faStopwatch} />
          </NavLink>
        </div>
        <div className="col-6 text-center">
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
  </Router>
);

ReactDom.render(<App />, document.getElementById("app"));
