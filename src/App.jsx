/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.scss";
import Dashboard from "./pages/dashboard/Dashboard";
import { RoutesOutlet } from "./routes/Routes";
import {Camera} from "./pages/camera/Camera";
import { CompanyHub } from "./pages/company/CompanyHub";
import { Main } from "./pages/main/Main";
import { Authorization } from "./components/authorization/Authorization";
import { useCookies } from "react-cookie";
import { Algorithm } from "./pages/algorithm/Algorithm";

import { AlgorithmPage } from "./pages/algorithmReport/AlgorithmPage";
function App() {
  const [cookies, setCookie] = useCookies(["token"]);

  return (
    <BrowserRouter>
      <Routes>
        {cookies.token ? (
          <Route element={<RoutesOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/company" element={<CompanyHub />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/algorithm" element={<Algorithm />} />
            <Route
              path="/machine_control"
              element={<AlgorithmPage control={"machine_control"} />}
            />
            <Route
              path="/safety_control_ear_protection"
              element={<AlgorithmPage control={"safety_control/safety"} />}
            />
              <Route
              path="/safety_control_reflective_jacket"
              element={<AlgorithmPage control={"safety_control_reflective_jacket"} />}
            />
            <Route
              path="/idle_control"
              element={<AlgorithmPage control={"idle_control"} />}
            />
            <Route
              path="/staff_control"
              element={<AlgorithmPage control={"staff_control"} />}
            />
          </Route>
        ) : (
          <Route path="/*" element={<Authorization />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
