import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { useAppSelector } from "./store/hooks";

import { Counter } from "./pages/Counter";
import { Chart } from "./pages/Chart";
import { FetalMovementChart } from "./pages/FMC";
import { Login } from "./pages/Login";
import { BottomNavbar } from "./components/BottomNavbar";

export const Routes = () => {
  const userToken = useAppSelector((state) => state.user.token);

  return (
    <Switch>
      {userToken && (
        <>
          <Route path="/" exact={true}>
            <Redirect to="/home" />
          </Route>
          <Route path="/home" exact={true}>
            <Counter />
          </Route>
          <Route path="/chart" exact={true}>
            <Chart />
          </Route>
          <Route path="/fmc" exact={true}>
            <FetalMovementChart />
          </Route>
          <BottomNavbar />
        </>
      )}
      {!userToken && (
        <>
          <Route path="/" exact={true}>
            <Redirect to="/login" />
          </Route>
          <Route path="/login" exact={true}>
            <Login />
          </Route>
        </>
      )}
    </Switch>
  );
};
