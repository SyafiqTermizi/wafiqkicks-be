import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { useAppSelector } from "./store/hooks";

import { Counter } from "./pages/Counter";
import { Chart } from "./pages/Chart";
import { FetalMovementChart } from "./pages/FMC";

import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ForgetPasswordReset } from "./pages/ForgetPasswordReset";

import { BottomNavbar } from "./components/BottomNavbar";

const AuthenticatedRoutes = () => (
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
    <BottomNavbar />
  </>
);

const UnauthenticatedRoutes = () => (
  <>
    <Route path="/" exact={true}>
      <Redirect to="/signin" />
    </Route>
    <Route path="/signin" exact={true}>
      <Signin />
    </Route>
    <Route path="/signup" exact={true}>
      <Signup />
    </Route>
    <Route path="/forget-password" exact={true}>
      <ForgetPassword />
    </Route>
    <Route path="/forget-password-reset/:uid/:token" exact={true}>
      <ForgetPasswordReset />
    </Route>
  </>
);

export const Routes = () => {
  const userToken = useAppSelector((state) => state.user.token);

  return (
    <Switch>
      {userToken && <AuthenticatedRoutes />}
      {!userToken && <UnauthenticatedRoutes />}
    </Switch>
  );
};
