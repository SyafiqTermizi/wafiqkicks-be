import * as React from "react";
import * as ReactDom from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { Routes } from "./Routes";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  );
};

ReactDom.render(<App />, document.getElementById("app"));
