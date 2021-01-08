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
    <br />
    <Link to="/">Home</Link>
    <br />
    <Link to="/chart">Chart</Link>
  </Router>
);

ReactDom.render(<App />, document.getElementById("app"));
