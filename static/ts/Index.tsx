import * as React from "react";
import * as ReactDom from "react-dom";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Counter } from "./pages/Counter";
import { Chart } from "./pages/Chart";

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact={true}>
        <Counter />
      </Route>
      <Route path="/chart" exact={true}>
        <Chart />
      </Route>
    </Switch>
    <div className="fixed-bottom navbar-light bg-light">
      <div className="row">
        <div className="col-6 text-center">
          <Link className="nav-link" to="/">
            Counter
          </Link>
        </div>
        <div className="col-6 text-center">
          <Link className="nav-link" to="/chart">
            Hourly Data
          </Link>
        </div>
      </div>
    </div>
  </Router>
);

ReactDom.render(<App />, document.getElementById("app"));
