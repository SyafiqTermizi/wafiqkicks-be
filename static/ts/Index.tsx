import * as React from "react";
import * as ReactDom from "react-dom";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Counter } from "./pages/Counter";
import { Chart } from "./pages/Chart";
import { BottomNavbar } from "./components/BottomNavbar";

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
    <BottomNavbar />
  </Router>
);

ReactDom.render(<App />, document.getElementById("app"));
